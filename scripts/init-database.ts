import { neon } from "@neondatabase/serverless"

async function initializeDatabase() {
  try {
    console.log("🚀 Initializing database...")

    // Check if DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL environment variable is not set")
      console.log("📝 Please add DATABASE_URL to your .env.local file")
      console.log("🔗 Get a free database at: https://neon.tech")
      return
    }

    // Create a connection to the database
    const sql = neon(process.env.DATABASE_URL!)

    // Test connection
    console

    // Sample memories
    const sampleMemories = [
      {
        title: "Beach Day Chaos",
        description: "When we tried to build a sandcastle but ended up in a sand fight",
        emoji: "🏖️",
        gradient: "from-blue-400 to-cyan-500",
        display_order: 1,
      },
      {
        title: "Game Night Madness",
        description: "The night Sarah flipped the Monopoly board",
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

    // Insert sample memories
    for (const memory of sampleMemories) {
      await sql`
    INSERT INTO memories (title, description, emoji, gradient, display_order)
    VALUES (${memory.title}, ${memory.description}, ${memory.emoji}, ${memory.gradient}, ${memory.display_order})
  `
    }
  } catch (error) {
    console.error("🔥 Error initializing database:", error)
  }
}

initializeDatabase()
