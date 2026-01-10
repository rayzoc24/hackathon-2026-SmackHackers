# API Contract (MVP)

## GET /resources
Returns a list of all study resources.

Response:
[
  {
    "title": "Python Basics",
    "category": "Engineering",
    "link": "https://example.com"
  }
]

---

## GET /colleges
Returns a list of colleges.

Response:
[
  {
    "name": "AP Shah Institute of Technology"
  }
]

---

## GET /events/<college_name>
Returns events for the selected college.

Response:
[
  {
    "title": "Tech Fest",
    "date": "2026-01-20",
    "time": "10:00 AM",
    "venue": "Main Auditorium"
  }
]
