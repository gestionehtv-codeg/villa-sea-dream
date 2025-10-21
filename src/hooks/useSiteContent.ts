import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteContent {
  [key: string]: string;
}

export const useSiteContent = (page: string, section?: string) => {
  const [content, setContent] = useState<SiteContent>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, [page, section]);

  const fetchContent = async () => {
    let query = supabase
      .from("site_content")
      .select("content_key, content_value")
      .eq("page", page);

    if (section) {
      query = query.eq("section", section);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching content:", error);
      setLoading(false);
      return;
    }

    if (data) {
      const contentMap: SiteContent = {};
      data.forEach((item) => {
        contentMap[item.content_key] = item.content_value;
      });
      setContent(contentMap);
    }
    setLoading(false);
  };

  const getContent = (key: string, defaultValue: string = "") => {
    return content[key] || defaultValue;
  };

  return { content, getContent, loading };
};
