/* Mock data for hubs, colleges and events */
window.APP = window.APP || {};
APP.data = {
  hubs: [
    {
      id: "data-science",
      name: "Data Science",
      desc: "Data analysis, machine learning and data engineering groups.",
      icon: "js/icons/hub.svg",
      video:
        "https://www.youtube.com/watch?v=UrsmFxEIp5k&pp=ygUScHl0aG9uIGZ1bGwgY291cnNl",
      videoLabel: "Python Crash Course",
    },
    {
      id: "ai-ml",
      name: "AI & ML",
      desc: "Artificial intelligence and machine learning clubs.",
      icon: "js/icons/hub.svg",
      video:
        "https://www.youtube.com/watch?v=UrsmFxEIp5k&pp=ygUScHl0aG9uIGZ1bGwgY291cnNl",
      videoLabel: "Python Crash Course",
    },
    {
      id: "civil-engineering",
      name: "Civil Engineering",
      desc: "Civil engineering societies and project teams.",
      icon: "js/icons/hub.svg",
    },
    {
      id: "mechanical-engineering",
      name: "Mechanical Engineering",
      desc: "Mechanical systems, design and robotics groups.",
      icon: "js/icons/hub.svg",
    },
    {
      id: "web-development",
      name: "Web Development",
      desc: "Frontend and backend web developer communities.",
      icon: "js/icons/hub.svg",
      video: "https://www.youtube.com/watch?v=G3e-cpL7ofc&t=14044s",
      videoLabel: "Frontend",
    },
    {
      id: "cybersecurity",
      name: "Cybersecurity",
      desc: "Information security clubs, CTFs and research.",
      icon: "js/icons/hub.svg",
      video:
        "https://www.youtube.com/watch?v=9HOpanT0GRs&pp=ygUVY3liZXIgc2VjdXJpdHkgY291cnNl",
      videoLabel: "Cyber Security Crash Course",
    },
  ],
  colleges: [
    {
      id: "datasci-col",
      name: "Data Science College",
      hub: "data-science",
      location: "City A",
      img: "js/icons/college.svg",
    },
    {
      id: "aiinstitute",
      name: "AI & ML Institute",
      hub: "ai-ml",
      location: "City B",
      img: "js/icons/college.svg",
    },
    {
      id: "civilcol",
      name: "Civil Engineering College",
      hub: "civil-engineering",
      location: "City C",
      img: "js/icons/college.svg",
    },
    {
      id: "mecheng",
      name: "Mechanical Engineering College",
      hub: "mechanical-engineering",
      location: "City D",
      img: "js/icons/college.svg",
    },
    {
      id: "webdev-col",
      name: "WebDev Institute",
      hub: "web-development",
      location: "City E",
      img: "js/icons/college.svg",
    },
    {
      id: "cyber-col",
      name: "Cybersecurity School",
      hub: "cybersecurity",
      location: "City F",
      img: "js/icons/college.svg",
    },
  ],
  events: [
    {
      id: 1,
      college: "All Colleges",
      title: "Hackathon",
      date: "2026-01-19",
      time: "10:00",
      location: "Main Hall",
      desc: "24-hour student hackathon.",
    },
    {
      id: 2,
      college: "All Colleges",
      title: "Ojus Cultural Fest",
      date: "2026-02-26",
      time: "10:00",
      location: "Main Hall",
      desc: "Inter-college cultural celebration.",
    },
    {
      id: 3,
      college: "All Colleges",
      title: "Antarang",
      date: "2026-03-21",
      time: "10:00",
      location: "Main Hall",
      desc: "Student art and performance showcase.",
    },
  ],
};
