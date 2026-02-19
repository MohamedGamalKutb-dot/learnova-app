import { Link } from "react-router-dom";
import { Button, Card, CardBody, Chip } from "@heroui/react";
import Logo from "../components/common/Logo";

import {
    Book1,
    Teacher,
    Award,
    ArrowRight2,
    Star1,
    VideoPlay,
    People,
    Timer1,
} from "iconsax-react";

const features = [
    {
        icon: <Book1 size={28} variant="Bold" />,
        title: "Rich Course Library",
        description:
            "Access hundreds of courses across programming, design, business, and more.",
        color: "from-indigo-500 to-blue-500",
    },
    {
        icon: <Teacher size={28} variant="Bold" />,
        title: "Expert Instructors",
        description:
            "Learn from industry professionals with real-world experience.",
        color: "from-pink-500 to-rose-500",
    },
    {
        icon: <Award size={28} variant="Bold" />,
        title: "Certificates",
        description:
            "Earn verified certificates to showcase your skills and achievements.",
        color: "from-amber-500 to-orange-500",
    },
    {
        icon: <VideoPlay size={28} variant="Bold" />,
        title: "HD Video Lessons",
        description:
            "High-quality video content with subtitles and playback controls.",
        color: "from-emerald-500 to-teal-500",
    },
];

const stats = [
    { value: "10K+", label: "Students", icon: <People size={20} /> },
    { value: "500+", label: "Courses", icon: <Book1 size={20} /> },
    { value: "50+", label: "Instructors", icon: <Teacher size={20} /> },
    { value: "24/7", label: "Support", icon: <Timer1 size={20} /> },
];

const popularCourses = [
    {
        id: 1,
        title: "React Mastery 2025",
        instructor: "Ahmed Ali",
        rating: 4.9,
        students: 2340,
        price: "$49.99",
        category: "Development",
        image:
            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
    },
    {
        id: 2,
        title: "UI/UX Design Bootcamp",
        instructor: "Sara Mohamed",
        rating: 4.8,
        students: 1820,
        price: "$39.99",
        category: "Design",
        image:
            "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
    },
    {
        id: 3,
        title: "Python for Data Science",
        instructor: "Omar Hassan",
        rating: 4.7,
        students: 3100,
        price: "$59.99",
        category: "Data Science",
        image:
            "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop",
    },
];

export default function Home() {
    return (
        <div className="page-enter">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/15 rounded-full blur-[120px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[150px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="animate-slide-left">
                            <Chip
                                color="secondary"
                                variant="flat"
                                size="sm"
                                className="mb-6"
                            >
                                🧠 New courses available this week
                            </Chip>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                                Learn Without{" "}
                                <span className="gradient-text">Limits</span>
                                <br />
                                <span className="text-gray-400 text-3xl sm:text-4xl lg:text-5xl font-bold">
                                    Build Your Future
                                </span>
                            </h1>

                            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg">
                                Unlock your potential with expert-led courses. Master new skills,
                                advance your career, and join a community of lifelong learners.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Button
                                    as={Link}
                                    to="/courses"
                                    size="lg"
                                    className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold px-8 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-shadow"
                                    endContent={<ArrowRight2 size={18} />}
                                >
                                    Explore Courses
                                </Button>
                                <Button
                                    as={Link}
                                    to="/register"
                                    variant="bordered"
                                    size="lg"
                                    className="border-white/20 text-white hover:bg-white/5 font-semibold px-8"
                                >
                                    Get Started Free
                                </Button>
                            </div>

                            {/* Stats Row */}
                            <div className="flex flex-wrap gap-8 mt-12">
                                {stats.map((stat) => (
                                    <div key={stat.label} className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
                                            {stat.icon}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-lg">
                                                {stat.value}
                                            </p>
                                            <p className="text-gray-500 text-xs">{stat.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Content - Hero Visual */}
                        <div className="hidden lg:flex justify-center animate-slide-right">
                            <div className="relative">
                                <div className="w-[420px] h-[420px] rounded-3xl bg-gradient-to-br from-indigo-500/20 to-pink-500/20 border border-white/10 p-6 animate-float">
                                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#111] to-[#1a1a2e] border border-white/5 flex flex-col items-center justify-center gap-6 p-8">
                                        <div className="w-24 h-24 flex items-center justify-center animate-pulse-glow mb-4">
                                            <Logo className="w-full h-full" showText={false} />
                                        </div>
                                        <h3 className="text-white text-xl font-bold text-center">
                                            Start Learning Today
                                        </h3>
                                        <p className="text-gray-400 text-sm text-center">
                                            Join thousands of students already building their future
                                        </p>
                                        <div className="flex gap-2 mt-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star1
                                                    key={star}
                                                    size={18}
                                                    variant="Bold"
                                                    className="text-amber-400"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* Floating Elements */}
                                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center backdrop-blur-sm">
                                    <Award size={24} variant="Bold" className="text-pink-400" />
                                </div>
                                <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center backdrop-blur-sm">
                                    <Teacher
                                        size={24}
                                        variant="Bold"
                                        className="text-indigo-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Chip color="primary" variant="flat" size="sm" className="mb-4">
                            Why LearnNeur?
                        </Chip>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Everything You Need to{" "}
                            <span className="gradient-text">Succeed</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Our platform provides the tools, resources, and community you need
                            to achieve your learning goals.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className="glass-card border-0 bg-transparent"
                                isPressable
                            >
                                <CardBody className="p-6 flex flex-col gap-4">
                                    <div
                                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg`}
                                    >
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-white font-semibold text-lg">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Courses Section */}
            <section className="py-24 bg-[#060609]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">
                                Popular <span className="gradient-text">Courses</span>
                            </h2>
                            <p className="text-gray-400">
                                Most popular courses chosen by our students
                            </p>
                        </div>
                        <Button
                            as={Link}
                            to="/courses"
                            variant="bordered"
                            className="border-white/20 text-white hover:bg-white/5"
                            endContent={<ArrowRight2 size={16} />}
                        >
                            View All
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {popularCourses.map((course) => (
                            <Card
                                key={course.id}
                                className="glass-card border-0 bg-transparent overflow-hidden"
                                isPressable
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
                                    <Chip
                                        size="sm"
                                        className="absolute top-3 right-3 bg-indigo-500/80 text-white backdrop-blur-sm"
                                    >
                                        {course.category}
                                    </Chip>
                                </div>
                                <CardBody className="p-5">
                                    <h3 className="text-white font-semibold text-lg mb-2">
                                        {course.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-3">
                                        {course.instructor}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <Star1
                                                size={14}
                                                variant="Bold"
                                                className="text-amber-400"
                                            />
                                            <span className="text-white text-sm font-medium">
                                                {course.rating}
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                                ({course.students.toLocaleString()})
                                            </span>
                                        </div>
                                        <span className="text-indigo-400 font-bold">
                                            {course.price}
                                        </span>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[150px]" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Ready to Start Your{" "}
                        <span className="gradient-text">Learning Journey</span>?
                    </h2>
                    <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                        Join thousands of students who are already building their skills and
                        advancing their careers with LearnNeur.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button
                            as={Link}
                            to="/register"
                            size="lg"
                            className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold px-10 shadow-lg shadow-indigo-500/30"
                        >
                            Get Started Free
                        </Button>
                        <Button
                            as={Link}
                            to="/courses"
                            variant="bordered"
                            size="lg"
                            className="border-white/20 text-white hover:bg-white/5 px-10"
                        >
                            Browse Courses
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
