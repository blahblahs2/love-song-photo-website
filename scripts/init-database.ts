import { neon } from "@neondatabase/serverless"

async function initializeDatabase() {
  try {
    console.log("🚀 Initializing database...")

    // Create a connection to the database
    const sql = neon(process.env.DATABASE_URL!)

    // Create photos table
    await sql`
      CREATE TABLE IF NOT EXISTS photos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        location VARCHAR(255),
        uploaded_by VARCHAR(100) NOT NULL,
        tags TEXT[],
        image_url TEXT NOT NULL,
        approved BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("✅ Photos table created or already exists")

    // Create songs table
    await sql`
      CREATE TABLE IF NOT EXISTS songs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        artist VARCHAR(255) NOT NULL,
        youtube_url VARCHAR(255) NOT NULL,
        youtube_id VARCHAR(255) NOT NULL,
        thumbnail_url VARCHAR(255) NOT NULL,
        description TEXT,
        added_by VARCHAR(100) NOT NULL,
        tags TEXT[],
        mood VARCHAR(100),
        lyrics TEXT,
        approved BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("✅ Songs table created or already exists")

    // Check if we have sample data
    const existingPhotos = await sql`SELECT COUNT(*) FROM photos`
    const count = Number(existingPhotos[0].count)

    // Add sample data if the table is empty
    if (count === 0) {
      console.log("📝 Adding sample data...")

      // Sample photos
      const samplePhotos = [
        {
          title: "Epic Beach Day",
          description: "When we all decided to build the world's worst sandcastle but had the best time doing it!",
          date: "2023-07-15",
          location: "Santa Monica Beach",
          uploaded_by: "Senghuot",
          tags: ["Beach Day", "Summer", "Squad Goals"],
          image_url: "/placeholder.svg?height=400&width=400",
          approved: true,
        },
        {
          title: "Game Night Chaos",
          description: "The night Kimhour flipped the Monopoly board and we all died laughing",
          date: "2023-08-20",
          location: "Dyheng's Apartment",
          uploaded_by: "Chanleang",
          tags: ["Game Night", "Funny", "Indoor"],
          image_url: "/placeholder.svg?height=400&width=400",
          approved: true,
        },
        {
          title: "Coffee Shop Takeover",
          description: "We literally stayed for 6 hours and they had to politely ask us to leave",
          date: "2023-09-10",
          location: "Central Perk Cafe",
          uploaded_by: "Somiet",
          tags: ["Coffee Date", "Chill", "Long Talks"],
          image_url: "/placeholder.svg?height=400&width=400",
          approved: true,
        },
        {
          title: "Hiking Adventure Gone Wrong",
          description: "We got lost for 3 hours but found the best view ever. Worth it!",
          date: "2023-10-05",
          location: "Griffith Observatory Trail",
          uploaded_by: "Ratanak",
          tags: ["Adventure", "Hiking", "Epic Fail"],
          image_url: "/placeholder.svg?height=400&width=400",
          approved: false, // This one needs approval
        },
      ]

      // Insert sample photos
      for (const photo of samplePhotos) {
        await sql`
          INSERT INTO photos (title, description, date, location, uploaded_by, tags, image_url, approved)
          VALUES (${photo.title}, ${photo.description}, ${photo.date}, ${photo.location}, ${photo.uploaded_by}, ${photo.tags}, ${photo.image_url}, ${photo.approved})
        `
      }

      // Sample songs
      const sampleSongs = [
        {
          title: "Squad Anthem",
          artist: "Our Group",
          youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          youtube_id: "dQw4w9WgXcQ",
          thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
          description: "The song that represents our friendship",
          added_by: "Lyteng",
          tags: ["Squad", "Anthem", "Friendship"],
          mood: "Energetic",
          lyrics:
            "We're the squad that never breaks\nThrough all the laughs and all mistakes\nTogether we're unstoppable\nOur friendship is unstoppable",
          approved: true,
        },
        {
          title: "Memory Lane",
          artist: "Nostalgia Crew",
          youtube_url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
          youtube_id: "kJQP7kiw5Fk",
          thumbnail_url: "https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg",
          description: "For all our beautiful memories together",
          added_by: "Lyheng",
          tags: ["Memories", "Nostalgia", "Friendship"],
          mood: "Nostalgic",
          lyrics:
            "Walking down our memory lane\nEvery step removes the pain\nOf missing all those golden days\nWhen we were young and free to play",
          approved: false, // Needs approval
        },
      ]

      // Insert sample songs
      for (const song of sampleSongs) {
        await sql`
          INSERT INTO songs (title, artist, youtube_url, youtube_id, thumbnail_url, description, added_by, tags, mood, lyrics, approved)
          VALUES (${song.title}, ${song.artist}, ${song.youtube_url}, ${song.youtube_id}, ${song.thumbnail_url}, ${song.description}, ${song.added_by}, ${song.tags}, ${song.mood}, ${song.lyrics}, ${song.approved})
        `
      }

      console.log("✅ Sample data added successfully")
    } else {
      console.log(`📊 Database already contains ${count} photos`)
    }

    console.log("🎉 Database initialization complete!")
    console.log("🔗 You can now upload photos and they will persist after refresh!")
  } catch (error) {
    console.error("❌ Error initializing database:", error)
  }
}

// Run the initialization
initializeDatabase()
