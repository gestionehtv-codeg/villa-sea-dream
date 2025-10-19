import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { addDays, isSameDay, isAfter, isBefore, format } from "date-fns";
import { it } from "date-fns/locale";

interface BookingCalendarProps {
  selectedRange: { from?: Date; to?: Date };
  onRangeSelect: (range: { from?: Date; to?: Date }) => void;
}

interface DailyPrice {
  date: string;
  price: number;
}

const BookingCalendar = ({ selectedRange, onRangeSelect }: BookingCalendarProps) => {
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [bookedRanges, setBookedRanges] = useState<Array<{ from: Date; to: Date }>>([]);
  const [dailyPrices, setDailyPrices] = useState<DailyPrice[]>([]);

  useEffect(() => {
    fetchAvailability();
    fetchBookings();
    fetchDailyPrices();
  }, []);

  const fetchAvailability = async () => {
    const { data } = await supabase
      .from("calendar_availability")
      .select("date")
      .eq("is_available", false);

    if (data) {
      setUnavailableDates(data.map((item) => new Date(item.date)));
    }
  };

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("check_in, check_out")
      .in("status", ["confirmed", "pending"]);

    if (error) {
      console.error("Error fetching bookings:", error);
      return;
    }

    if (data) {
      const ranges = data.map((booking) => ({
        from: new Date(booking.check_in),
        to: new Date(booking.check_out),
      }));
      setBookedRanges(ranges);
    }
  };

  const fetchDailyPrices = async () => {
    const { data, error } = await supabase
      .from("daily_prices")
      .select("date, price");

    if (error) {
      console.error("Error fetching daily prices:", error);
      return;
    }

    if (data) {
      setDailyPrices(data);
    }
  };

  const isDateUnavailable = (date: Date) => {
    // Check if date is in unavailable dates
    if (unavailableDates.some((d) => isSameDay(d, date))) {
      return true;
    }

    // Check if date is within any booked range
    return bookedRanges.some(
      (range) =>
        (isAfter(date, range.from) || isSameDay(date, range.from)) &&
        (isBefore(date, range.to) || isSameDay(date, range.to))
    );
  };

  const handleSelect = (range: any) => {
    if (!range) {
      onRangeSelect({});
      return;
    }

    // Validate that no dates in the range are unavailable
    if (range.from && range.to) {
      let currentDate = range.from;
      while (isBefore(currentDate, range.to) || isSameDay(currentDate, range.to)) {
        if (isDateUnavailable(currentDate)) {
          // If any date is unavailable, reset selection
          onRangeSelect({ from: range.from });
          return;
        }
        currentDate = addDays(currentDate, 1);
      }
    }

    onRangeSelect(range);
  };

  const getDayPrice = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const priceData = dailyPrices.find(p => p.date === dateStr);
    return priceData?.price;
  };

  return (
    <div className="w-full">
      <Calendar
        mode="range"
        selected={selectedRange.from && selectedRange.to ? selectedRange as any : undefined}
        onSelect={handleSelect}
        disabled={(date) => isDateUnavailable(date) || isBefore(date, new Date())}
        locale={it}
        className="rounded-md border shadow-luxury w-full"
      modifiers={{
        unavailable: (date) => isDateUnavailable(date),
      }}
      modifiersStyles={{
        unavailable: {
          textDecoration: "line-through",
          color: "hsl(var(--muted-foreground))",
          opacity: 0.5,
        },
      }}
      components={{
        DayContent: ({ date }) => {
          const price = getDayPrice(date);
          return (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <span>{date.getDate()}</span>
              {price && (
                <span className="text-xs text-primary font-semibold">
                  €{price}
                </span>
              )}
            </div>
          );
        },
      }}
      />
    </div>
  );
};

export default BookingCalendar;
