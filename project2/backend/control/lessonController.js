const Lesson = require('../models/lessonModel');
const User = require('../models/userModel');

// Create a new lesson
exports.createLesson = async (req, res) => {
  try {
    const { teacher, student, subject, date, duration, cost, status, notes } = req.body;

    if (!teacher || !subject || !date || !cost) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const newLesson = new Lesson({
      teacher,
      student: student || null,
      subject,
      date,
      duration: duration || 60,
      cost,
      status: status || 'available',
      notes: notes || '',
    });

    const savedLesson = await newLesson.save();
    res.status(201).json(savedLesson);
  } catch (error) {
    res.status(500).json({ message: 'Error creating lesson', error });
  }
};

// Get all lessons
exports.getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find()
      .populate('teacher', 'firstName lastName email')
      .populate('student', 'firstName lastName email')
      .sort({ date: 1 });

    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lessons', error });
  }
};

// Get lesson by ID
exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('teacher', 'firstName lastName email')
      .populate('student', 'firstName lastName email');

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lesson', error });
  }
};

// Delete lesson by ID
exports.deleteLesson = async (req, res) => {
  try {
    const deletedLesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!deletedLesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.status(200).json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lesson', error });
  }
};

// Get lessons by subject
exports.getLessonsBySubject = async (req, res) => {
  try {
    const lessons = await Lesson.find({ subject: req.params.subject })
      .populate('teacher', 'firstName lastName')
      .populate('student', 'firstName lastName');
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lessons by subject', error });
  }
};

// Get lessons by date
exports.getLessonsByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    const lessons = await Lesson.find({
      date: { $gte: date, $lt: nextDay },
    })
      .populate('teacher', 'firstName lastName')
      .populate('student', 'firstName lastName');

    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lessons by date', error });
  }
};

// Get lessons by teacher
exports.getLessonsByTeacher = async (req, res) => {
  try {
    const lessons = await Lesson.find({ teacher: req.params.teacher })
      .populate('teacher', 'firstName lastName')
      .populate('student', 'firstName lastName');
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lessons by teacher', error });
  }
};

// Get lessons by student
exports.getLessonsByStudent = async (req, res) => {
  try {
    const lessons = await Lesson.find({ student: req.params.student })
      .populate('teacher', 'firstName lastName')
      .populate('student', 'firstName lastName');
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lessons by student', error });
  }
};

// Get lessons by status (available, booked, completed)
exports.getLessonsByStatus = async (req, res) => {
  try {
    const lessons = await Lesson.find({ status: req.params.status })
      .populate('teacher', 'firstName lastName')
      .populate('student', 'firstName lastName');
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lessons by status', error });
  }
};

// Get lessons by price range
exports.getLessonsByPriceRange = async (req, res) => {
  try {
    const min = parseFloat(req.params.minPrice);
    const max = parseFloat(req.params.maxPrice);

    const lessons = await Lesson.find({
      cost: { $gte: min, $lte: max },
    })
      .populate('teacher', 'firstName lastName')
      .populate('student', 'firstName lastName');

    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lessons by price range', error });
  }
};

// Composite / Advanced search (multiple filters)
exports.searchLessons = async (req, res) => {
  try {
    const { subject, status, teacher, student, minPrice, maxPrice, startDate, endDate } = req.query;

    const filter = {};

    if (subject) filter.subject = subject;
    if (status) filter.status = status;
    if (teacher) filter.teacher = teacher;
    if (student) filter.student = student;
    if (minPrice || maxPrice)
      filter.cost = {
        ...(minPrice ? { $gte: parseFloat(minPrice) } : {}),
        ...(maxPrice ? { $lte: parseFloat(maxPrice) } : {}),
      };
    if (startDate || endDate)
      filter.date = {
        ...(startDate ? { $gte: new Date(startDate) } : {}),
        ...(endDate ? { $lte: new Date(endDate) } : {}),
      };

    const lessons = await Lesson.find(filter)
      .populate('teacher', 'firstName lastName')
      .populate('student', 'firstName lastName')
      .sort({ date: 1 });

    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Error performing search', error });
  }
};
