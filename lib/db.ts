import { neon } from "@neondatabase/serverless"

// Create a connection to the Neon database with error handling
let sql: any = null

function createConnection() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL environment variable is not set")
      return null
    }
    return neon(process.env.DATABASE_URL)
  } catch (error) {
    console.error("Failed to create database connection:", error)
    return null
  }
}

// Initialize the database with required tables
export async function initDatabase() {
  try {
    if (!sql) {
      sql = createConnection()
      if (!sql) {
        throw new Error("Failed to create database connection")
      }
    }

    // Create members table if it doesn't exist
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

    // Create memories table if it doesn't exist
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

    // Create photos table if it doesn't exist
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

    // Create songs table if it doesn't exist
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

    console.log("Database initialized successfully")
    return true
  } catch (error) {
    console.error("Failed to initialize database:", error)
    return false
  }
}

// Helper function to ensure connection
async function ensureConnection() {
  if (!sql) {
    sql = createConnection()
    if (!sql) {
      throw new Error("Database connection not available")
    }
  }
  return sql
}

// Member database operations (new)
export async function getAllMembersFromDB() {
  try {
    const connection = await ensureConnection()
    const members = await connection`SELECT * FROM members WHERE active = true ORDER BY name ASC`
    return members
  } catch (error) {
    console.error("Error fetching all members:", error)
    return []
  }
}

export async function addMemberToDB(member: {
  name: string
  nickname?: string
  role?: string
  bio?: string
  avatar_url?: string
}) {
  try {
    const connection = await ensureConnection()
    const result = await connection`
      INSERT INTO members (name, nickname, role, bio, avatar_url)
      VALUES (${member.name}, ${member.nickname || ""}, ${member.role || "Member"}, ${member.bio || ""}, ${member.avatar_url || ""})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error adding member to database:", error)
    throw error
  }
}

export async function updateMemberInDB(
  id: number,
  member: {
    name?: string
    nickname?: string
    role?: string
    bio?: string
    avatar_url?: string
  },
) {
  try {
    const connection = await ensureConnection()
    const result = await connection`
      UPDATE members 
      SET 
        name = COALESCE(${member.name}, name),
        nickname = COALESCE(${member.nickname}, nickname),
        role = COALESCE(${member.role}, role),
        bio = COALESCE(${member.bio}, bio),
        avatar_url = COALESCE(${member.avatar_url}, avatar_url)
      WHERE id = ${id}
      RETURNING *
    `
    return result[0] || null
  } catch (error) {
    console.error("Error updating member:", error)
    throw error
  }
}

export async function deleteMemberFromDB(id: number) {
  try {
    const connection = await ensureConnection()
    // Soft delete - set active to false instead of actually deleting
    const result = await connection`
      UPDATE members SET active = false WHERE id = ${id}
      RETURNING *
    `
    return result.length > 0
  } catch (error) {
    console.error("Error deleting member:", error)
    return false
  }
}

export async function getMemberByIdFromDB(id: number) {
  try {
    const connection = await ensureConnection()
    const result = await connection`SELECT * FROM members WHERE id = ${id} AND active = true`
    return result[0] || null
  } catch (error) {
    console.error("Error fetching member by ID:", error)
    return null
  }
}

// Photo database operations (existing)
export async function getAllPhotosFromDB() {
  try {
    const connection = await ensureConnection()
    const photos = await connection`SELECT * FROM photos ORDER BY created_at DESC`
    return photos
  } catch (error) {
    console.error("Error fetching all photos:", error)
    return []
  }
}

export async function getApprovedPhotosFromDB() {
  try {
    const connection = await ensureConnection()
    const photos = await connection`SELECT * FROM photos WHERE approved = true ORDER BY created_at DESC`
    return photos
  } catch (error) {
    console.error("Error fetching approved photos:", error)
    return []
  }
}

export async function getPendingPhotosFromDB() {
  try {
    const connection = await ensureConnection()
    const photos = await connection`SELECT * FROM photos WHERE approved = false ORDER BY created_at DESC`
    return photos
  } catch (error) {
    console.error("Error fetching pending photos:", error)
    return []
  }
}

export async function addPhotoToDB(photo: {
  title: string
  description: string
  date: string
  location: string
  uploaded_by: string
  tags: string[]
  image_url: string
}) {
  try {
    const connection = await ensureConnection()
    const result = await connection`
      INSERT INTO photos (title, description, date, location, uploaded_by, tags, image_url, approved)
      VALUES (${photo.title}, ${photo.description}, ${photo.date}, ${photo.location}, ${photo.uploaded_by}, ${photo.tags}, ${photo.image_url}, false)
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error adding photo to database:", error)
    throw error
  }
}

export async function approvePhotoInDB(id: number) {
  try {
    const connection = await ensureConnection()
    const result = await connection`
      UPDATE photos SET approved = true WHERE id = ${id}
      RETURNING *
    `
    return result.length > 0
  } catch (error) {
    console.error("Error approving photo:", error)
    return false
  }
}

export async function deletePhotoFromDB(id: number) {
  try {
    const connection = await ensureConnection()
    const result = await connection`
      DELETE FROM photos WHERE id = ${id}
      RETURNING *
    `
    return result.length > 0
  } catch (error) {
    console.error("Error deleting photo:", error)
    return false
  }
}

export async function getPhotoByIdFromDB(id: number) {
  try {
    const connection = await ensureConnection()
    const result = await connection`SELECT * FROM photos WHERE id = ${id}`
    return result[0] || null
  } catch (error) {
    console.error("Error fetching photo by ID:", error)
    return null
  }
}

// Song database operations (existing)
export async function getAllSongsFromDB() {
  try {
    const connection = await ensureConnection()
    const songs = await connection`SELECT * FROM songs ORDER BY created_at DESC`
    return songs
  } catch (error) {
    console.error("Error fetching all songs:", error)
    return []
  }
}

export async function getApprovedSongsFromDB() {
  try {
    const connection = await ensureConnection()
    const songs = await connection`SELECT * FROM songs WHERE approved = true ORDER BY created_at DESC`
    return songs
  } catch (error) {
    console.error("Error fetching approved songs:", error)
    return []
  }
}

export async function getPendingSongsFromDB() {
  try {
    const connection = await ensureConnection()
    const songs = await connection`SELECT * FROM songs WHERE approved = false ORDER BY created_at DESC`
    return songs
  } catch (error) {
    console.error("Error fetching pending songs:", error)
    return []
  }
}

export async function addSongToDB(song: {
  title: string
  artist: string
  youtube_url: string
  youtube_id: string
  duration?: string
  thumbnail_url?: string
  description?: string
  added_by: string
  tags: string[]
  mood?: string
  lyrics?: string
}) {
  try {
    const connection = await ensureConnection()
    const result = await connection`
      INSERT INTO songs (title, artist, youtube_url, youtube_id, duration, thumbnail_url, description, added_by, tags, mood, lyrics, approved)
      VALUES (${song.title}, ${song.artist}, ${song.youtube_url}, ${song.youtube_id}, ${song.duration || ""}, ${song.thumbnail_url || ""}, ${song.description || ""}, ${song.added_by}, ${song.tags}, ${song.mood || ""}, ${song.lyrics || ""}, false)
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error adding song to database:", error)
    throw error
  }
}

export async function approveSongInDB(id: number) {
  try {
    const connection = await ensureConnection()
    const result = await connection`
      UPDATE songs SET approved = true WHERE id = ${id}
      RETURNING *
    `
    return result.length > 0
  } catch (error) {
    console.error("Error approving song:", error)
    return false
  }
}

export async function deleteSongFromDB(id: number) {
  try {
    const connection = await ensureConnection()
    const result = await connection`
      DELETE FROM songs WHERE id = ${id}
      RETURNING *
    `
    return result.length > 0
  } catch (error) {
    console.error("Error deleting song:", error)
    return false
  }
}

export async function getSongByIdFromDB(id: number) {
  try {
    const connection = await ensureConnection()
    const result = await connection`SELECT * FROM songs WHERE id = ${id}`
    return result[0] || null
  } catch (error) {
    console.error("Error fetching song by ID:", error)
    return null
  }
}

// Memory database operations (new)
export async function getAllMemoriesFromDB() {
  try {
    const connection = await ensureConnection()
    const memories =
      await connection`SELECT * FROM memories WHERE active = true ORDER BY display_order ASC, created_at DESC`
    return memories
  } catch (error) {
    console.error("Error fetching all memories:", error)
    return []
  }
}

export async function addMemoryToDB(memory: {
  title: string
  description: string
  emoji: string
  gradient: string
  display_order?: number
}) {
  try {
    const connection = await ensureConnection()
    const result = await connection`
      INSERT INTO memories (title, description, emoji, gradient, display_order)
      VALUES (${memory.title}, ${memory.description}, ${memory.emoji}, ${memory.gradient}, ${memory.display_order || 0})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error adding memory to database:", error)
    throw error
  }
}

export async function updateMemoryInDB(
  id: number,
  memory: {
    title?: string
    description?: string
    emoji?: string
    gradient?: string
    display_order?: number
  },
) {
  try {
    const connection = await ensureConnection()
    const result = await connection`
      UPDATE memories 
      SET 
        title = COALESCE(${memory.title}, title),
        description = COALESCE(${memory.description}, description),
        emoji = COALESCE(${memory.emoji}, emoji),
        gradient = COALESCE(${memory.gradient}, gradient),
        display_order = COALESCE(${memory.display_order}, display_order)
      WHERE id = ${id}
      RETURNING *
    `
    return result[0] || null
  } catch (error) {
    console.error("Error updating memory:", error)
    throw error
  }
}

export async function deleteMemoryFromDB(id: number) {
  try {
    const connection = await ensureConnection()
    // Soft delete - set active to false instead of actually deleting
    const result = await connection`
      UPDATE memories SET active = false WHERE id = ${id}
      RETURNING *
    `
    return result.length > 0
  } catch (error) {
    console.error("Error deleting memory:", error)
    return false
  }
}

export async function getMemoryByIdFromDB(id: number) {
  try {
    const connection = await ensureConnection()
    const result = await connection`SELECT * FROM memories WHERE id = ${id} AND active = true`
    return result[0] || null
  } catch (error) {
    console.error("Error fetching memory by ID:", error)
    return null
  }
}
