// Node.js script to generate 1,000 high-quality books (125 per category) for BookHaven
const fs = require('fs');
const path = require('path');

// Curated Unsplash book covers for each category
const COVERS = {
  "Fiction": [
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1476275466078-4cad320e7cbe?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop&crop=center"
  ],
  "Technology": [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop&crop=center"
  ],
  "Self-Development": [
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1508672019048-805b876b67e2?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=600&fit=crop&crop=center"
  ],
  "Business": [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1520607164069-c25526143aef?w=400&h=600&fit=crop&crop=center"
  ],
  "Science": [
    "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1564325724739-bae0bd08762c?w=400&h=600&fit=crop&crop=center"
  ],
  "Biography": [
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=center"
  ],
  "Romance": [
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1501901609772-df0848060b33?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=600&fit=crop&crop=center"
  ],
  "Mystery": [
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1514537092201-99527ec3cfcb?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?w=400&h=600&fit=crop&crop=center"
  ]
};

const BADGES = ["Bestseller", "Top Rated", "Trending", "Staff Pick", "Classic", "Sale", "Must Read", null, null, null];

// Real and curated author & title seeds per category
const SEED_DATA = {
  "Fiction": {
    authors: [
      "Matt Haig", "Gabriel García Márquez", "Haruki Murakami", "Donna Tartt", "Neil Gaiman",
      "Chimamanda Ngozi Adichie", "Kazuo Ishiguro", "George Orwell", "Virginia Woolf", "F. Scott Fitzgerald",
      "J.D. Salinger", "Arundhati Roy", "Yann Martel", "Markus Zusak", "Khaled Hosseini",
      "Paulo Coelho", "Cormac McCarthy", "David Mitchell", "Min Jin Lee", "Carlos Ruiz Zafón",
      "Anthony Doerr", "Taylor Jenkins Reid", "Sally Rooney", "Hanya Yanagihara", "Delia Owens",
      "Madeline Miller", "Susanna Clarke", "Emily St. John Mandel", "Gabrielle Zevin", "R.F. Kuang",
      "Genki Kawamura", "Yoko Ogawa", "Sayaka Murata", "Toshikazu Kawaguchi", "Sun-mi Hwang",
      "Durjoy Datta", "Ruskin Bond", "R.K. Narayan", "Jhumpa Lahiri", "Salman Rushdie",
      "Amitav Ghosh", "Aravind Adiga", "Vikram Seth", "Anita Desai", "Kiran Desai"
    ],
    titles: [
      "The Midnight Library", "One Hundred Years of Solitude", "Norwegian Wood", "The Secret History",
      "Neverwhere", "Americanah", "Never Let Me Go", "1984", "To the Lighthouse", "The Great Gatsby",
      "The Catcher in the Rye", "The God of Small Things", "Life of Pi", "The Book Thief",
      "The Kite Runner", "A Thousand Splendid Suns", "The Alchemist", "The Road", "Cloud Atlas",
      "Pachinko", "The Shadow of the Wind", "All the Light We Cannot See", "The Seven Husbands of Evelyn Hugo",
      "Normal People", "A Little Life", "Where the Crawdads Sing", "Circe", "The Song of Achilles",
      "Piranesi", "Station Eleven", "Sea of Tranquility", "Tomorrow, and Tomorrow, and Tomorrow", "Babel",
      "Kafka on the Shore", "The Memory Police", "Convenience Store Woman", "Before the Coffee Gets Cold",
      "Days at the Morisaki Bookshop", "What You Are Looking for is in the Library", "The Housekeeper and the Professor",
      "Sweet Bean Paste", "The Hen Who Dreamed She Could Fly", "Please Look After Mom", "The White Tiger",
      "A Suitable Boy", "The Namesake", "Midnight's Children", "The Shadow Lines", "The Palace of Illusions",
      "Clear Light of Day", "The Inheritance of Loss", "Interpreter of Maladies", "Sea of Poppies",
      "The Blue Umbrella", "Malgudi Days", "Swami and Friends", "The Guide", "Untouchable",
      "Train to Pakistan", "Tomb of Sand", "Ghachar Ghochar", "Cobalt Blue", "Em and the Big Hoom"
    ]
  },
  "Technology": {
    authors: [
      "Robert C. Martin", "Martin Fowler", "Andrew Hunt", "David Thomas", "Donald Knuth",
      "Alex Xu", "Aurélien Géron", "Ian Goodfellow", "Christopher Bishop", "Eric Evans",
      "Gene Kim", "Jez Humble", "Brendan Eich", "Douglas Crockford", "Kyle Simpson",
      "Marijn Haverbeke", "Al Sweigart", "Luciano Ramalho", "Jon Skeet", "Steve McConnell",
      "Kent Beck", "Michael Feathers", "Addy Osmani", "Sandi Metz", "Sam Newman",
      "Alex Petrov", "Martin Kleppmann", "Erich Gamma", "Richard Helm", "Ralph Johnson",
      "John Ousterhout", "Cay S. Horstmann", "Brian W. Kernighan", "Dennis M. Ritchie", "Bjarne Stroustrup",
      "Scott Meyers", "Joshua Bloch", "Venkat Subramaniam", "Kavitha Rangan", "Prateek Narang"
    ],
    titles: [
      "Clean Code", "The Pragmatic Programmer", "Designing Data-Intensive Applications", "Code Complete",
      "Structure and Interpretation of Computer Programs", "Design Patterns: Elements of Reusable Object-Oriented Software",
      "Introduction to Algorithms", "You Don't Know JS Yet", "JavaScript: The Good Parts", "Refactoring: Improving the Design of Existing Code",
      "Building Microservices", "Continuous Delivery", "The Phoenix Project", "Accelerate: The Science of Lean Software and DevOps",
      "Site Reliability Engineering", "Grokking Algorithms", "Computer Networking: A Top-Down Approach",
      "Modern Operating Systems", "Clean Architecture", "Domain-Driven Design: Tackling Complexity in the Heart of Software",
      "Cracking the Coding Interview", "System Design Interview – An Insider's Guide", "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow",
      "Deep Learning", "Pattern Recognition and Machine Learning", "Python Crash Course", "Eloquent JavaScript",
      "Automate the Boring Stuff with Python", "Fluent Python", "C# in Depth", "Working Effectively with Legacy Code",
      "A Philosophy of Software Design", "The Linux Programming Interface", "Database Internals: A Deep Dive",
      "Kubernetes in Action", "Docker Deep Dive", "Learning SQL", "High Performance Browser Networking",
      "Web Scalability for Startup Engineers", "The Art of Computer Programming", "Compilers: Principles, Techniques, and Tools",
      "The C Programming Language", "The C++ Programming Language", "Effective Java", "Effective TypeScript",
      "Microservices Patterns", "Staff Engineer: Leadership Beyond the Management Track", "An Elegant Puzzle: Systems of Engineering Management",
      "Release It! Design and Deploy Production-Ready Software", "Grokking Simplicity: Taming Complex Systems with Functional Thinking",
      "Building Event-Driven Microservices", "Cloud Native Patterns", "Fundamentals of Software Architecture",
      "Software Engineering at Google", "Clean Craftsmanship", "Tidy First? A Personal Guide to Software Design",
      "Network Programmability and Automation", "Practical Statistics for Data Scientists", "Deep Learning with Python",
      "Generative AI in Practice", "Prompt Engineering for Generative AI", "Building LLM Apps with LangChain"
    ]
  },
  "Self-Development": {
    authors: [
      "James Clear", "Stephen R. Covey", "Cal Newport", "Carol S. Dweck", "Napoleon Hill",
      "Dale Carnegie", "Mark Manson", "Brianna Wiest", "Eckhart Tolle", "Viktor E. Frankl",
      "David Goggins", "Greg McKeown", "Austin Kleon", "Ryan Holiday", "Marcus Aurelius",
      "Angela Duckworth", "Jim Kwik", "Robin Sharma", "Mihaly Csikszentmihalyi", "Brené Brown",
      "Daniel H. Pink", "Susan Cain", "Simon Sinek", "Morgan Housel", "Darren Hardy",
      "BJ Fogg", "Don Miguel Ruiz", "Gaur Gopal Das", "Jay Shetty", "Radhakrishnan Pillai",
      "Sadhguru", "Swami Vivekananda", "J. Krishnamurti", "Osho", "Deepak Chopra"
    ],
    titles: [
      "Atomic Habits", "The 7 Habits of Highly Effective People", "Deep Work", "Mindset: The New Psychology of Success",
      "Think and Grow Rich", "How to Win Friends and Influence People", "The Subtle Art of Not Giving a F*ck",
      "The Mountain Is You", "The Power of Now", "Man's Search for Meaning", "Can't Hurt Me",
      "Essentialism: The Disciplined Pursuit of Less", "Show Your Work!", "Steal Like an Artist",
      "Digital Minimalism", "Make Time: How to Focus on What Matters Every Day", "The Courage to Be Disliked",
      "Ego is the Enemy", "The Obstacle is the Way", "The Daily Stoic", "Stillness is the Key",
      "Meditations", "Grit: The Power of Passion and Perseverance", "Limitless: Upgrade Your Brain",
      "The 5 AM Club", "Flow: The Psychology of Optimal Experience", "Daring Greatly", "Quiet: The Power of Introverts",
      "Start with Why", "The Psychology of Money", "The Compound Effect", "Tiny Habits",
      "The Four Agreements", "Life's Amazing Secrets", "Think Like a Monk", "Karma: A Yogi's Guide to Crafting Your Destiny",
      "Chanakya Neeti", "Rethinking Positive Thinking", "Feel the Fear and Do It Anyway", "Awaken the Giant Within",
      "Master Your Emotions", "Psycho-Cybernetics", "The Miracle Morning", "Hyperfocus",
      "The War of Art", "Turning Pro", "Eat That Frog!", "The Power of Habit", "Indistractable",
      "Do It Today", "Goodbye, Things: On Minimalist Living", "Ikigai: The Japanese Secret to a Long and Happy Life",
      "Kaizen: The Japanese Method for Transforming Habits", "Wabi Sabi: Japanese Wisdom for a Perfectly Imperfect Life",
      "Kintsugi: Finding Strength in Imperfection", "The Art of Living", "Inner Engineering: A Yogi's Guide to Joy",
      "Freedom from the Known", "Raja Yoga", "The Secret of Karma"
    ]
  },
  "Business": {
    authors: [
      "Eric Ries", "Peter Thiel", "Jim Collins", "Josh Kaufman", "Daniel Kahneman",
      "Ben Horowitz", "Clayton M. Christensen", "John Doerr", "Jason Fried", "David Heinemeier Hansson",
      "Ray Dalio", "Phil Knight", "W. Chan Kim", "Renée Mauborgne", "Nir Eyal",
      "Andrew S. Grove", "Geoffrey A. Moore", "Reid Hoffman", "Tony Hsieh", "Michael E. Gerber",
      "Chris Voss", "Annie Duke", "Brad Feld", "Robert Iger", "Michael E. Porter",
      "Bill Campbell", "Salim Ismail", "Alexander Osterwalder", "Gabriel Weinberg", "Alistair Croll",
      "Reed Hastings", "Kim Scott", "Jocko Willink", "Verne Harnish", "Gino Wickman",
      "Raghuram Rajan", "N.R. Narayana Murthy", "Ratan Tata", "Subroto Bagchi", "Pawan Munjal"
    ],
    titles: [
      "The Lean Startup", "Zero to One: Notes on Startups", "Good to Great", "The Personal MBA",
      "Thinking, Fast and Slow", "The Hard Thing About Hard Things", "The Innovator's Dilemma",
      "Measure What Matters: OKRs", "Rework", "Principles: Life and Work", "Shoe Dog: A Memoir by the Creator of Nike",
      "Blue Ocean Strategy", "Hooked: How to Build Habit-Forming Products", "High Output Management",
      "Crossing the Chasm", "Blitzscaling: The Lightning-Fast Path to Building Massively Valuable Companies",
      "Delivering Happiness", "The E-Myth Revisited", "Never Split the Difference", "Thinking in Bets",
      "Venture Deals", "The Ride of a Lifetime", "Competitive Strategy", "Trillion Dollar Coach",
      "Exponential Organizations", "Value Proposition Design", "Business Model Generation",
      "Traction: How Any Startup Can Achieve Explosive Customer Growth", "Lean Analytics", "No Rules Rules: Netflix and the Culture of Reinvention",
      "Radical Candor", "Leaders Eat Last", "The Culture Code", "Extreme Ownership", "Scaling Up: Mastering the Rockefeller Habits",
      "Traction: Get a Grip on Your Business", "Built to Sell", "The Mom Test", "Obviously Awesome",
      "Sprint: How to Solve Big Problems and Test New Ideas in Just Five Days", "Contagious: Why Things Catch On",
      "Made to Stick", "Positioning: The Battle for Your Mind", "Building a StoryBrand", "Play Bigger",
      "Good Strategy Bad Strategy", "The Goal: A Process of Ongoing Improvement", "Fault Lines",
      "A Better India: A Better World", "The High Performance Entrepreneur", "I Too Had a Dream",
      "Stay Hungry Stay Foolish", "Connect the Dots", "The Habit of Winning", "The Tata Log",
      "From Jugaad to Systematic Innovation", "The Dhandho Investor", "Romancing the Balance Sheet"
    ]
  },
  "Science": {
    authors: [
      "Yuval Noah Harari", "Stephen Hawking", "Carl Sagan", "Richard Dawkins", "Neil deGrasse Tyson",
      "Brian Greene", "Rachel Carson", "Jared Diamond", "Siddhartha Mukherjee", "Randall Munroe",
      "Carlo Rovelli", "Richard P. Feynman", "Sean Carroll", "Peter Wohlleben", "James Nestor",
      "Bill Bryson", "Merlin Sheldrake", "Thomas S. Kuhn", "Michio Kaku", "Geoffrey West",
      "James Gleick", "Philipp Dettmer", "Giulia Enders", "Oliver Sacks", "Edward O. Wilson",
      "David Deutsch", "Max Tegmark", "Nick Bostrom", "Sabine Hossenfelder", "Lawrence M. Krauss",
      "C.V. Raman", "Homi J. Bhabha", "Jayant V. Narlikar", "A.P.J. Abdul Kalam", "Venki Ramakrishnan"
    ],
    titles: [
      "Sapiens: A Brief History of Humankind", "A Brief History of Time", "Cosmos", "The Selfish Gene",
      "Astrophysics for People in a Hurry", "The Elegant Universe", "Silent Spring", "Guns, Germs, and Steel",
      "The Gene: An Intimate History", "The Emperor of All Maladies: A Biography of Cancer", "What If? Serious Scientific Answers to Absurd Hypothetical Questions",
      "Thing Explainer: Complicated Stuff in Simple Words", "Seven Brief Lessons on Physics", "The Order of Time",
      "Helgoland: Making Sense of the Quantum Revolution", "Reality Is Not What It Seems", "Six Easy Pieces",
      "Surely You're Joking, Mr. Feynman!", "The Fabric of the Cosmos", "Until the End of Time",
      "The Hidden Life of Trees", "Breath: The New Science of a Lost Art", "The Body: A Guide for Occupants",
      "Entangled Life: How Fungi Make Our Worlds", "The Demon-Haunted World: Science as a Candle in the Dark",
      "Pale Blue Dot: A Vision of the Human Future in Space", "Contact", "Quantum: Einstein, Bohr, and the Great Debate",
      "The Structure of Scientific Revolutions", "Brief Answers to the Big Questions", "Physics of the Impossible",
      "The Future of Humanity", "The God Delusion", "The Blind Watchmaker", "Scale: The Universal Laws of Growth",
      "Chaos: Making a New Science", "Immune: A Journey into the Mysterious System That Keeps You Alive",
      "Gut: The Inside Story of Our Body's Most Underrated Organ", "The Man Who Mistook His Wife for a Hat",
      "The Diversity of Life", "The Beginning of Infinity", "Life 3.0: Being Human in the Age of Artificial Intelligence",
      "Superintelligence: Paths, Dangers, Strategies", "Existential Physics", "A Universe from Nothing",
      "Gene Machine: The Race to Decipher the Secrets of the Ribosome", "The Structure of Space-Time",
      "Wings of Fire: An Autobiography", "Ignited Minds", "Seven Wonders of the Cosmos"
    ]
  },
  "Biography": {
    authors: [
      "Tara Westover", "Walter Isaacson", "Michelle Obama", "Anne Frank", "Nelson Mandela",
      "Trevor Noah", "Paul Kalanithi", "Malcolm X", "Alex Haley", "Malala Yousafzai",
      "Phil Knight", "A.P.J. Abdul Kalam", "Andre Agassi", "David McCullough", "Ron Chernow",
      "Stacy Schiff", "Doris Kearns Goodwin", "William Manchester", "Alice Schroeder", "Anthony Bourdain",
      "Ernest Hemingway", "Patti Smith", "Jeannette Walls", "Cheryl Strayed", "Elie Wiesel",
      "Michelle Zauner", "Matthew McConaughey", "Stanley Tucci", "Bono", "Matthew Perry",
      "Prince Harry", "Viola Davis", "Paris Hilton", "Jon Krakauer", "Ramachandra Guha",
      "Shashi Tharoor", "Khushwant Singh", "Sanjay Baru", "Priyanka Chopra Jonas", "Sachin Tendulkar"
    ],
    titles: [
      "Educated: A Memoir", "Steve Jobs", "Becoming", "The Diary of a Young Girl",
      "Long Walk to Freedom", "Born a Crime: Stories from a South African Childhood", "When Breath Becomes Air",
      "The Autobiography of Malcolm X", "I Am Malala", "Shoe Dog: A Memoir",
      "Wings of Fire", "Open: An Autobiography", "Leonardo da Vinci", "Einstein: His Life and Universe",
      "Benjamin Franklin: An American Life", "Elon Musk", "Churchill: A Life", "Frida: A Biography of Frida Kahlo",
      "Alexander Hamilton", "Cleopatra: A Life", "Team of Rivals: The Political Genius of Abraham Lincoln",
      "The Last Lion: Winston Spencer Churchill", "The Snowball: Warren Buffett and the Business of Life",
      "Kitchen Confidential: Adventures in the Culinary Underbelly", "A Moveable Feast", "Just Kids",
      "The Glass Castle", "Wild: From Lost to Found on the Pacific Crest Trail", "Night",
      "Crying in H Mart", "Greenlights", "Taste: My Life Through Food", "Surrender: 40 Songs, One Story",
      "Friends, Lovers, and the Big Terrible Thing", "Spare", "Finding Me: A Memoir", "Paris: The Memoir",
      "Into the Wild", "Into Thin Air", "India After Gandhi", "Gandhi: The Years That Changed the World",
      "Nehru: The Invention of India", "An Era of Darkness: The British Empire in India",
      "Playing It My Way: My Autobiography", "Unfinished: A Memoir", "The Accidental Prime Minister",
      "Truth, Love and a Little Malice", "The Golden Threshold", "Waiting for a Visa: Babasaheb Ambedkar"
    ]
  },
  "Romance": {
    authors: [
      "Jane Austen", "Taylor Jenkins Reid", "Colleen Hoover", "Ali Hazelwood", "Emily Henry",
      "Casey McQuiston", "Sally Rooney", "Madeline Miller", "Jojo Moyes", "Nicholas Sparks",
      "Diana Gabaldon", "Charlotte Brontë", "Emily Brontë", "Graeme Simsion", "Rainbow Rowell",
      "Audrey Niffenegger", "David Nicholls", "Sarah J. Maas", "Jennifer L. Armentrout", "Jenna Evans Welch",
      "Lynn Painter", "Rachel Lynn Solomon", "Nicola Yoon", "Carley Fortune", "Abby Jimenez",
      "Alice Oseman", "Beth O'Leary", "Elena Armas", "Sally Thorne", "Jesse Q. Sutanto",
      "Ravinder Singh", "Durjoy Datta", "Preeti Shenoy", "Sudeep Nagarkar", "Novoneel Chakraborty",
      "Anuja Chauhan", "Twinkle Khanna", "Kavita Kane", "Chitra Banerjee Divakaruni", "Savina Singh"
    ],
    titles: [
      "Pride and Prejudice", "The Seven Husbands of Evelyn Hugo", "It Ends with Us", "It Starts with Us",
      "The Love Hypothesis", "Beach Read", "People We Meet on Vacation", "Book Lovers",
      "Red, White & Royal Blue", "Normal People", "The Song of Achilles", "Me Before You",
      "The Notebook", "Outlander", "Jane Eyre", "Wuthering Heights", "Emma",
      "Sense and Sensibility", "Persuasion", "The Rosie Project", "Eleanor & Park",
      "Fangirl", "The Time Traveler's Wife", "One Day", "A Court of Thorns and Roses",
      "From Blood and Ash", "Love & Gelato", "Better Than the Movies", "Today Tonight Tomorrow",
      "Instructions for Dancing", "Every Summer After", "Meet Me at the Lake", "Love and Other Words",
      "Part of Your World", "Yours Truly", "Heartstopper", "The Flatshare",
      "The Spanish Love Deception", "The Hating Game", "Dial A for Aunties", "I Too Had a Love Story",
      "Can Love Happen Twice?", "Of Course I Love You... Till I Find Someone Better", "The Secret Wishlist",
      "Life is What You Make It", "A Hundred Little Flames", "Few Things Left Unsaid",
      "That's the Way We Met", "The Zoya Factor", "Those Pricey Thakur Girls",
      "Battle for Bittora", "The Forest of Enchantments", "The Palace of Illusions", "Pyjamas Are Forgiving",
      "Mrs Funnybones", "A Thousand Boy Kisses", "Reminders of Him", "Ugly Love", "Archer's Voice"
    ]
  },
  "Mystery": {
    authors: [
      "Alex Michaelides", "Gillian Flynn", "Agatha Christie", "Stieg Larsson", "Tana French",
      "Dan Brown", "Arthur Conan Doyle", "Raymond Chandler", "Dashiell Hammett", "James M. Cain",
      "Daphne du Maurier", "Dennis Lehane", "A.J. Finn", "Paula Hawkins", "Liane Moriarty",
      "Colleen Hoover", "Mary Kubica", "Nita Prose", "Lucy Foley", "Anthony Horowitz",
      "Richard Osman", "Jo Nesbø", "Jane Harper", "Scott Turow", "William Landay",
      "Shari Lapena", "B.A. Paris", "Ruth Ware", "Stuart Turton", "Kareena Kapoor",
      "Satyajit Ray", "Sharadindu Bandyopadhyay", "Ashwin Sanghi", "Vikram Chandra", "Sujoy Ghosh",
      "Surender Mohan Pathak", "Madhumita Bhattacharyya", "Kishore Kumar", "Bhaskar Chattopadhyay", "Aniruddha Bahal"
    ],
    titles: [
      "The Silent Patient", "Gone Girl", "And Then There Were None", "The Girl with the Dragon Tattoo",
      "In the Woods", "The Da Vinci Code", "Angels & Demons", "The Hound of the Baskervilles",
      "A Study in Scarlet", "Murder on the Orient Express", "The ABC Murders", "The Big Sleep",
      "The Maltese Falcon", "The Postman Always Rings Twice", "Rebecca", "Shutter Island",
      "Sharp Objects", "Dark Places", "The Woman in the Window", "The Girl on the Train",
      "Big Little Lies", "Verity", "Local Woman Missing", "The Maid",
      "The Paris Apartment", "The Guest List", "The Hunting Party", "One by One",
      "Magpie Murders", "Moonflower Murders", "The Thursday Murder Club", "The Man Who Died Twice",
      "The Bullet That Missed", "The Last Devil to Die", "Mystic River", "The Snowman",
      "The Dry", "Force of Nature", "Presumed Innocent", "Defending Jacob",
      "The Couple Next Door", "Behind Closed Doors", "The Woman in Cabin 10", "The 7½ Deaths of Evelyn Hardcastle",
      "The Complete Adventures of Feluda", "Byomkesh Bakshi Mysteries", "The Rozabal Line", "The Krishna Key",
      "Sacred Games", "The Sialkot Saga", "The Vault of Vishnu", "The Magicians of Fez",
      "Dead Meat", "Club You to Death", "Patang", "The Karachi Deception",
      "Dial A for Murder", "The Shadow District", "The Chestnut Man", "The Chalk Man"
    ]
  }
};

// Generates engaging 2-3 sentence description
function generateDescription(title, author, category) {
  const templates = {
    "Fiction": [
      `A magnificent story crafted with breathtaking literary mastery by ${author}. Explore complex human relationships, untold journeys, and an unforgettable narrative woven into the pages of "${title}".`,
      `In "${title}", ${author} weaves an immersive world filled with emotional resonance and richly drawn characters. A captivating reading experience celebrated by book lovers worldwide.`,
      `Winner of universal acclaim, "${title}" takes readers on a poignant and lyrical adventure. ${author} examines love, grief, longing, and redemption with striking prose.`
    ],
    "Technology": [
      `An indispensable resource for software engineers, developers, and architects. In "${title}", ${author} breaks down complex engineering concepts into pragmatic, production-grade insights.`,
      `Master modern software craft and system architecture with "${title}". Written by industry authority ${author}, this book provides battle-tested principles and practical patterns.`,
      `A timeless guide to writing resilient, clean, and scalable systems. ${author} shares deep insights and actionable real-world methodologies in "${title}".`
    ],
    "Self-Development": [
      `Transform your mindset, sharpen your focus, and achieve lasting growth. In "${title}", ${author} presents a practical roadmap backed by behavioral science and real-world results.`,
      `Discover how small deliberate actions create exponential life improvements. "${title}" by ${author} offers profound wisdom for personal and professional excellence.`,
      `Break through self-limiting beliefs and design the life you envision. ${author} delivers clarity, purpose, and actionable daily frameworks in "${title}".`
    ],
    "Business": [
      `An essential playbook for modern founders, executives, and innovators. "${title}" by ${author} distills decades of market strategy and leadership wisdom into actionable insights.`,
      `Learn how to navigate competition, drive high-velocity growth, and build lasting organizational value. ${author} reveals crucial frameworks in "${title}".`,
      `From ideation to market dominance, "${title}" offers deep strategic perspective. ${author} breaks down the playbook for winning in competitive global industries.`
    ],
    "Science": [
      `A breathtaking exploration of natural laws, the cosmos, and the wonders of existence. In "${title}", ${author} translates cutting-edge discoveries into luminous prose.`,
      `Delve into the deepest questions of our universe and human evolution. "${title}" by ${author} opens a window into the frontiers of scientific understanding.`,
      `An eye-opening journey through empirical science and discovery. ${author} illuminates the unseen forces shaping reality and life itself in "${title}".`
    ],
    "Biography": [
      `An intimate and revelatory journey into an extraordinary life. In "${title}", ${author} paints an indelible portrait of courage, ambition, and historic impact.`,
      `A candid, deeply personal chronicle that inspires and moves readers. "${title}" reflects the trials, triumphs, and unforgettable legacy of a true pioneer.`,
      `Drawing from rare archives and heartfelt recollections, "${title}" captures the defining moments of an iconic journey told with honesty by ${author}.`
    ],
    "Romance": [
      `A heartwarming and unforgettable tale of fate, chemistry, and enduring passion. In "${title}", ${author} delivers witty banter and electric romance.`,
      `Get swept off your feet in "${title}". ${author} crafts an irresistible story of two souls discovering that the greatest risk in life is daring to love.`,
      `A beloved romance masterpiece brimming with charm, emotional depth, and page-turning chemistry. ${author} will steal your heart in "${title}".`
    ],
    "Mystery": [
      `A pulse-pounding psychological thriller packed with unexpected twists and heart-stopping suspense. In "${title}", ${author} keeps you guessing until the final page.`,
      `Dark secrets, hidden motives, and a gripping race against the clock. "${title}" showcases ${author} at the absolute peak of suspense storytelling.`,
      `Every clue matters in this masterclass of deduction and intrigue. ${author} delivers a chilling mystery in "${title}" that you won't be able to put down.`
    ]
  };

  const pool = templates[category] || templates["Fiction"];
  const hash = Math.abs((title.length * 31 + author.length * 17) % pool.length);
  return pool[hash];
}

// Generate 125 books for each of the 8 categories = exactly 1,000 books
const CATEGORIES = ["Fiction", "Technology", "Self-Development", "Business", "Science", "Biography", "Romance", "Mystery"];
const TARGET_PER_CAT = 125;
const ALL_BOOKS = [];
let globalId = 1;

CATEGORIES.forEach(category => {
  const seed = SEED_DATA[category];
  const catCovers = COVERS[category];
  const titles = seed.titles;
  const authors = seed.authors;

  for (let i = 0; i < TARGET_PER_CAT; i++) {
    let title;
    let author;

    if (i < titles.length) {
      title = titles[i];
      author = authors[i % authors.length];
    } else {
      // Create creative variations with volume / subtitle / thematic extensions
      const baseTitle = titles[i % titles.length];
      const baseAuthor = authors[(i + 7) % authors.length];
      const suffixes = [
        "Special Edition",
        "The Complete Guide",
        "Expanded Edition",
        "Chronicles",
        "The Journey",
        "Legacy Edition",
        "Masterclass",
        "Volume II",
        "Field Guide",
        "The Definitive Collection",
        "Handbook",
        "Annotated Edition",
        "Reflections",
        "Illustrated Edition"
      ];
      const suffix = suffixes[(i * 3 + globalId) % suffixes.length];
      title = `${baseTitle}: ${suffix}`;
      author = baseAuthor;
    }

    const cover = catCovers[i % catCovers.length];
    const badge = BADGES[(i * 7 + globalId) % BADGES.length];

    // Realistic prices in INR (₹)
    const pricePoints = [299, 349, 399, 449, 499, 549, 599, 649, 699, 749, 799, 849, 899, 949, 999, 1099, 1199, 1299, 1399, 1499];
    const price = pricePoints[(i * 5 + globalId) % pricePoints.length];
    const discountAdditions = [150, 200, 250, 300, 350, 400, 500];
    const originalPrice = price + discountAdditions[(i + globalId) % discountAdditions.length];

    // Ratings between 4.1 and 4.9
    const ratingDecimals = [4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9];
    const rating = ratingDecimals[(i * 3 + globalId) % ratingDecimals.length];

    // Reviews between 140 and 9,800
    const reviews = 150 + ((i * 137 + globalId * 89) % 9650);

    const description = generateDescription(title, author, category);

    ALL_BOOKS.push({
      id: globalId++,
      title,
      author,
      category,
      price,
      originalPrice,
      rating,
      reviews,
      badge,
      cover,
      description
    });
  }
});

console.log(`Generated ${ALL_BOOKS.length} books across ${CATEGORIES.length} categories (${TARGET_PER_CAT} per category).`);

// Retain CATEGORY_ICONS definition
const CATEGORY_ICONS_STR = `// Aesthetic Category icons with modern gradients and glowing shadows
const CATEGORY_ICONS = {
  "Fiction": {
    icon: "fa-wand-magic-sparkles",
    gradient: "linear-gradient(135deg, #6366F1, #8B5CF6)",
    color: "#6366F1",
    shadow: "rgba(99, 102, 241, 0.45)"
  },
  "Technology": {
    icon: "fa-microchip",
    gradient: "linear-gradient(135deg, #0EA5E9, #2563EB)",
    color: "#0EA5E9",
    shadow: "rgba(14, 165, 233, 0.45)"
  },
  "Self-Development": {
    icon: "fa-compass",
    gradient: "linear-gradient(135deg, #10B981, #059669)",
    color: "#10B981",
    shadow: "rgba(16, 185, 129, 0.45)"
  },
  "Business": {
    icon: "fa-arrow-trend-up",
    gradient: "linear-gradient(135deg, #F59E0B, #D97706)",
    color: "#F59E0B",
    shadow: "rgba(245, 158, 11, 0.45)"
  },
  "Science": {
    icon: "fa-atom",
    gradient: "linear-gradient(135deg, #8B5CF6, #D946EF)",
    color: "#8B5CF6",
    shadow: "rgba(139, 92, 246, 0.45)"
  },
  "Biography": {
    icon: "fa-feather-pointed",
    gradient: "linear-gradient(135deg, #EF4444, #DC2626)",
    color: "#EF4444",
    shadow: "rgba(239, 68, 68, 0.45)"
  },
  "Romance": {
    icon: "fa-heart",
    gradient: "linear-gradient(135deg, #EC4899, #F43F5E)",
    color: "#EC4899",
    shadow: "rgba(236, 72, 153, 0.45)"
  },
  "Mystery": {
    icon: "fa-fingerprint",
    gradient: "linear-gradient(135deg, #334155, #0F172A)",
    color: "#475569",
    shadow: "rgba(51, 65, 85, 0.45)"
  }
};
`;

const fileContent = `// ============================================================
//  data.js — Complete BookHaven Catalogue (1,000 books, 8 categories)
//  Exactly 125 curated books per category | Prices in INR (₹)
// ============================================================
const BOOKS = ${JSON.stringify(ALL_BOOKS, null, 2)};

${CATEGORY_ICONS_STR}
`;

const outputPath = path.join(__dirname, 'js', 'data.js');
fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log(`Successfully wrote ${ALL_BOOKS.length} books to ${outputPath}`);
