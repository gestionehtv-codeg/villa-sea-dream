import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface StoryContent {
  title: string;
  content: string;
  image_url: string | null;
}

const Story = () => {
  const [story, setStory] = useState<StoryContent | null>(null);

  useEffect(() => {
    fetchStory();
  }, []);

  const fetchStory = async () => {
    const { data, error } = await supabase
      .from("story_content")
      .select("*")
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching story:", error);
      return;
    }

    if (data) {
      setStory(data);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 gradient-sand pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary text-center mb-8">
              {story?.title || "La Nostra Storia"}
            </h1>
            
            {story?.image_url && (
              <div className="mb-8 rounded-lg overflow-hidden shadow-luxury">
                <img
                  src={story.image_url}
                  alt={story.title}
                  className="w-full h-[400px] object-cover"
                />
              </div>
            )}
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-secondary whitespace-pre-wrap leading-relaxed">
                {story?.content || "Contenuto in arrivo..."}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Story;
