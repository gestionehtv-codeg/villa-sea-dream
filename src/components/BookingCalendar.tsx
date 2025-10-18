import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { addDays, isSameDay, isAfter, isBefore } from "date-fns";
import { it } from "date-fns/locale";

interface BookingCalendarProps {
  selectedRange: { from?: Date; to?: Date };
  onRangeSelect: (range: { from?: Date; to?: Date }) => void;
}

const BookingCalendar = ({ selectedRange, onRangeSelect }: BookingCalendarProps) => {
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [bookedRanges, setBookedRanges] = useState<Array<{ from: Date; to: Date }>>([]);

  useEffect(() => {
    fetchAvailability();
    fetchBookings();
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
    const { data } = await supabase
      .from("bookings")
      .select("check_in, check_out")
      .in("status", ["confirmed", "pending"]);

    if (data) {
      setBookedRanges(
        data.map((booking) => ({
          from: new Date(booking.check_in),
          to: new Date(booking.check_out),
        }))
      );
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

  return (
    <Calendar
      mode="range"
      selected={selectedRange.from && selectedRange.to ? selectedRange as any : undefined}
      onSelect={handleSelect}
      disabled={(date) => isDateUnavailable(date) || isBefore(date, new Date())}
      locale={it}
      className="rounded-md border shadow-luxury pointer-events-auto"
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
    />
  );
};

export default BookingCalendar;
