-- Update gallery images URLs to use public folder
UPDATE gallery_images 
SET image_url = CASE 
  WHEN title = 'Villa Mare - Vista Principale' THEN '/images/villa-hero.jpg'
  WHEN title = 'Piscina Privata' THEN '/images/villa-pool.jpg'
  WHEN title = 'Camera da Letto' THEN '/images/villa-bedroom.jpg'
  WHEN title = 'Interni Eleganti' THEN '/images/villa-interior.jpg'
  WHEN title = 'Terrazza Panoramica' THEN '/images/villa-terrace.jpg'
  WHEN title = 'Vista sulla Spiaggia' THEN '/images/beach-view.jpg'
END
WHERE title IN ('Villa Mare - Vista Principale', 'Piscina Privata', 'Camera da Letto', 'Interni Eleganti', 'Terrazza Panoramica', 'Vista sulla Spiaggia');