import { Card, CardBody, Progress, Button, Avatar, Chip } from "@heroui/react";
import { useAuth } from "../hooks/useAuth";
import {
    Book1,
    Clock,
    Award,
    Chart21,
    ArrowRight2,
    Star1,
    VideoPlay,
    Notification,
    Calendar,
} from "iconsax-react";
import { Link } from "react-router-dom";

const enrolledCourses = [
    {
        id: 1,
        title: "React Mastery 2025",
        progress: 65,
        lessons: 24,
        completed: 16,
        image:
            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=120&h=80&fit=crop",
    },
    {
        id: 2,
        title: "UI/UX Design Bootcamp",
        progress: 30,
        lessons: 18,
        completed: 5,
        image:
            "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=120&h=80&fit=crop",
    },
    {
        id: 3,
        title: "Python for Data Science",
        progress: 85,
        lessons: 32,
        completed: 27,
        image:
            "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=120&h=80&fit=crop",
    },
];

const statsCards = [
    {
        label: "Courses Enrolled",
        value: "8",
        icon: <Book1 size={22} variant="Bold" />,
        color: "from-indigo-500 to-blue-500",
        change: "+2 this month",
    },
    {
        label: "Hours Learned",
        value: "142",
        icon: <Clock size={22} variant="Bold" />,
        color: "from-pink-500 to-rose-500",
        change: "+12 this week",
    },
    {
        label: "Certificates",
        value: "5",
        icon: <Award size={22} variant="Bold" />,
        color: "from-amber-500 to-orange-500",
        change: "+1 this month",
    },
    {
        label: "Avg. Score",
        value: "92%",
        icon: <Chart21 size={22} variant="Bold" />,
        color: "from-emerald-500 to-teal-500",
        change: "+3% improvement",
    },
];

const upcomingLessons = [
    {
        title: "Advanced Hooks in React",
        course: "React Mastery 2025",
        time: "Today, 3:00 PM",
        duration: "45 min",
    },
    {
        title: "Wireframing Best Practices",
        course: "UI/UX Design Bootcamp",
        time: "Tomorrow, 10:00 AM",
        duration: "60 min",
    },
    {
        title: "Pandas DataFrames",
        course: "Python for Data Science",
        time: "Wed, 2:00 PM",
        duration: "50 min",
    },
];

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <Avatar
                        name={user?.name || "User"}
                        size="lg"
                        isBordered
                        color="secondary"
                        className="ring-2 ring-indigo-500/30"
                        src={user?.avatar}
                    />
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            Welcome back,{" "}
                            <span className="gradient-text">
                                {user?.name || "Learner"}
                            </span>
                            ! 👋
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Continue your learning journey. You&apos;re doing great!
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        isIconOnly
                        variant="flat"
                        className="bg-white/5 text-gray-400 hover:text-white"
                    >
                        <Notification size={20} />
                    </Button>
                    <Button
                        as={Link}
                        to="/courses"
                        size="sm"
                        className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold"
                        endContent={<ArrowRight2 size={16} />}
                    >
                        Browse Courses
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statsCards.map((stat) => (
                    <Card key={stat.label} className="glass-card border-0 bg-transparent">
                        <CardBody className="p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div
                                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}
                                >
                                    {stat.icon}
                                </div>
                                <Chip
                                    size="sm"
                                    variant="flat"
                                    color="success"
                                    className="text-xs"
                                >
                                    {stat.change}
                                </Chip>
                            </div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                        </CardBody>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Enrolled Courses */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white">
                            Continue Learning
                        </h2>
                        <Button
                            variant="light"
                            size="sm"
                            className="text-indigo-400"
                            endContent={<ArrowRight2 size={14} />}
                        >
                            View All
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {enrolledCourses.map((course) => (
                            <Card
                                key={course.id}
                                className="glass-card border-0 bg-transparent"
                                isPressable
                            >
                                <CardBody className="p-4">
                                    <div className="flex gap-4 items-center">
                                        <img
                                            src={course.image}
                                            alt={course.title}
                                            className="w-20 h-14 rounded-xl object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white font-semibold text-sm mb-1 truncate">
                                                {course.title}
                                            </h3>
                                            <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                                                <span className="flex items-center gap-1">
                                                    <VideoPlay size={12} />
                                                    {course.completed}/{course.lessons} lessons
                                                </span>
                                            </div>
                                            <Progress
                                                value={course.progress}
                                                size="sm"
                                                color="secondary"
                                                className="max-w-full"
                                                aria-label={`${course.title} progress`}
                                            />
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-indigo-400 font-bold text-lg">
                                                {course.progress}%
                                            </p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Upcoming Lessons */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white">Upcoming</h2>
                        <Calendar size={18} className="text-gray-400" />
                    </div>

                    <div className="space-y-3">
                        {upcomingLessons.map((lesson, index) => (
                            <Card
                                key={index}
                                className="glass-card border-0 bg-transparent"
                            >
                                <CardBody className="p-4">
                                    <h3 className="text-white font-medium text-sm mb-1">
                                        {lesson.title}
                                    </h3>
                                    <p className="text-gray-500 text-xs mb-2">{lesson.course}</p>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-indigo-400 flex items-center gap-1">
                                            <Clock size={12} />
                                            {lesson.time}
                                        </span>
                                        <Chip size="sm" variant="flat" className="text-xs">
                                            {lesson.duration}
                                        </Chip>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    {/* Achievement Card */}
                    <Card className="mt-4 bg-gradient-to-br from-indigo-500/20 to-pink-500/20 border border-indigo-500/20">
                        <CardBody className="p-5 text-center">
                            <div className="flex justify-center mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star1
                                        key={star}
                                        size={16}
                                        variant="Bold"
                                        className="text-amber-400"
                                    />
                                ))}
                            </div>
                            <h3 className="text-white font-semibold text-sm mb-1">
                                Keep it up! 🎉
                            </h3>
                            <p className="text-gray-400 text-xs">
                                You&apos;re in the top 10% of learners this week
                            </p>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}
