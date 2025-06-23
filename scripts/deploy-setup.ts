import { neon } from "@neondatabase/serverless"

async function setupProductionDatabase() {
  try {
    console.log("🚀 Setting up production database for deployment...")

    // Use the production database URL
    const DATABASE_URL =
      "postgresql://friend_owner:npg_FASnNjRyx46E@ep-dry-meadow-a8i6bfv7-pooler.eastus2.azure.neon.tech/friend?sslmode=require"

    if (!DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured")
    }

    const sql = neon(DATABASE_URL)

    // Test connection
    console.log("🔌 Testing database connection...")
    await sql`SELECT 1 as test`
    console.log("✅ Database connection successful!")

    // Create all tables with proper error handling
    console.log("📋 Creating database tables...")

    // Members table
    await sql`
      CREATE TABLE IF NOT EXISTS members (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        nickname VARCHAR(100),
        role VARCHAR(100) DEFAULT 'Member',
        joined_date DATE DEFAULT CURRENT_DATE,
        avatar_url TEXT,
        bio TEXT,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("✅ Members table created!")

    // Photos table
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
    console.log("✅ Photos table created!")

    // Songs table
    await sql`
      CREATE TABLE IF NOT EXISTS songs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        artist VARCHAR(255) NOT NULL,
        youtube_url TEXT NOT NULL,
        youtube_id VARCHAR(50) NOT NULL,
        duration VARCHAR(20),
        thumbnail_url TEXT,
        description TEXT,
        added_by VARCHAR(100) NOT NULL,
        tags TEXT[],
        mood VARCHAR(50),
        lyrics TEXT,
        approved BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("✅ Songs table created!")

    // Memories table
    await sql`
      CREATE TABLE IF NOT EXISTS memories (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        emoji VARCHAR(10) NOT NULL,
        gradient VARCHAR(100) NOT NULL,
        display_order INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("✅ Memories table created!")

    // Check if members exist and add default ones
    const memberCount = await sql`SELECT COUNT(*) FROM members`
    console.log(`📊 Current members: ${memberCount[0].count}`)

    if (Number(memberCount[0].count) === 0) {
      console.log("👥 Adding default squad members...")

      const defaultMembers = [
        { name: "Senghuot", nickname: "", role: "Member", bio: "One of the original squad members" },
        { name: "Kimhour", nickname: "", role: "Admin", bio: "The admin and organizer of the squad" },
        { name: "Chanleang", nickname: "", role: "Member", bio: "Always brings the good vibes" },
        { name: "Dyheng", nickname: "", role: "Member", bio: "The photographer of the group" },
        { name: "Somiet", nickname: "", role: "Member", bio: "Music lover and playlist curator" },
        { name: "Ratanak", nickname: "", role: "Member", bio: "Adventure seeker and trip planner" },
        { name: "Lyteng", nickname: "", role: "Member", bio: "The comedian of the squad" },
        { name: "Lyheng", nickname: "", role: "Member", bio: "Creative mind and idea generator" },
      ]

      for (const member of defaultMembers) {
        await sql`
          INSERT INTO members (name, nickname, role, bio, active)
          VALUES (${member.name}, ${member.nickname}, ${member.role}, ${member.bio}, true)
        `
        console.log(`✅ Added member: ${member.name}`)
      }
    }

    // Check if memories exist and add default ones
    const memoryCount = await sql`SELECT COUNT(*) FROM memories`
    console.log(`📊 Current memories: ${memoryCount[0].count}`)

    if (Number(memoryCount[0].count) === 0) {
      console.log("🎉 Adding default squad memories...")

      const defaultMemories = [
        {
          title: "Beach Day Chaos",
          description: "When we tried to build a sandcastle but ended up in a sand fight",
          emoji: "🏖️",
          gradient: "from-blue-400 to-cyan-500",
          display_order: 1,
        },
        {
          title: "Game Night Madness",
          description: "The night someone flipped the Monopoly board",
          emoji: "🎮",
          gradient: "from-indigo-400 to-blue-500",
          display_order: 2,
        },
        {
          title: "Coffee Shop Takeover",
          description: "We literally stayed for 6 hours and they had to kick us out",
          emoji: "☕",
          gradient: "from-cyan-400 to-teal-500",
          display_order: 3,
        },
      ]

      for (const memory of defaultMemories) {
        await sql`
          INSERT INTO memories (title, description, emoji, gradient, display_order, active)
          VALUES (${memory.title}, ${memory.description}, ${memory.emoji}, ${memory.gradient}, ${memory.display_order}, true)
        `
        console.log(`✅ Added memory: ${memory.title}`)
      }
    }

    // Add sample photos if none exist
    const photoCount = await sql`SELECT COUNT(*) FROM photos`
    console.log(`📊 Current photos: ${photoCount[0].count}`)

    if (Number(photoCount[0].count) === 0) {
      console.log("📸 Adding sample photos...")

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
          title: "Coffee Shop Adventure",
          description: "We literally stayed for 6 hours and they had to politely ask us to leave",
          date: "2023-09-10",
          location: "Central Perk Cafe",
          uploaded_by: "Somiet",
          tags: ["Coffee Date", "Chill", "Long Talks"],
          image_url: "/placeholder.svg?height=400&width=400",
          approved: false, // This one needs approval
        },
      ]

      for (const photo of samplePhotos) {
        await sql`
          INSERT INTO photos (title, description, date, location, uploaded_by, tags, image_url, approved)
          VALUES (${photo.title}, ${photo.description}, ${photo.date}, ${photo.location}, ${photo.uploaded_by}, ${photo.tags}, ${photo.image_url}, ${photo.approved})
        `
        console.log(`✅ Added photo: ${photo.title}`)
      }
    }

    // Add sample songs if none exist
    const songCount = await sql`SELECT COUNT(*) FROM songs`
    console.log(`📊 Current songs: ${songCount[0].count}`)

    if (Number(songCount[0].count) === 0) {
      console.log("🎵 Adding sample songs...")

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

      for (const song of sampleSongs) {
        await sql`
          INSERT INTO songs (title, artist, youtube_url, youtube_id, thumbnail_url, description, added_by, tags, mood, lyrics, approved)
          VALUES (${song.title}, ${song.artist}, ${song.youtube_url}, ${song.youtube_id}, ${song.thumbnail_url}, ${song.description}, ${song.added_by}, ${song.tags}, ${song.mood}, ${song.lyrics}, ${song.approved})
        `
        console.log(`✅ Added song: ${song.title}`)
      }
    }

    console.log("🎉 Production database setup complete!")
    console.log("📝 Summary:")
    console.log(`   - Members: ${(await sql`SELECT COUNT(*) FROM members`)[0].count}`)
    console.log(`   - Photos: ${(await sql`SELECT COUNT(*) FROM photos`)[0].count}`)
    console.log(`   - Songs: ${(await sql`SELECT COUNT(*) FROM songs`)[0].count}`)
    console.log(`   - Memories: ${(await sql`SELECT COUNT(*) FROM memories`)[0].count}`)
    console.log("🚀 Your website is ready to deploy!")

    return true
  } catch (error) {
    console.error("❌ Error setting up production database:", error)
    return false
  }
}

// Run the setup
setupProductionDatabase()
