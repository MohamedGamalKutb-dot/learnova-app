import { useState } from "react";
import {
    Card,
    CardBody,
    Button,
    Input,
    Chip,
    Select,
    SelectItem,
} from "@heroui/react";
import { SearchNormal1, Star1, People, Filter } from "iconsax-react";
import { Link } from "react-router-dom";

const categories = [
    "All",
    "Development",
    "Design",
    "Data Science",
    "Business",
    "Marketing",
];

const allCourses = [
    {
        id: 1,
        title: "React Mastery 2025",
        instructor: "Ahmed Ali",
        rating: 4.9,
        students: 2340,
        price: "$49.99",
        category: "Development",
        level: "Intermediate",
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
        level: "Beginner",
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
        level: "Advanced",
        image:
            "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop",
    },
    {
        id: 4,
        title: "Digital Marketing Mastery",
        instructor: "Lina Khalil",
        rating: 4.6,
        students: 1450,
        price: "$34.99",
        category: "Marketing",
        level: "Beginner",
        image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    },
    {
        id: 5,
        title: "Node.js Backend Development",
        instructor: "Mohamed Youssef",
        rating: 4.8,
        students: 2200,
        price: "$54.99",
        category: "Development",
        level: "Intermediate",
        image:
            "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
    },
    {
        id: 6,
        title: "Business Strategy Essentials",
        instructor: "Nadia Sami",
        rating: 4.5,
        students: 980,
        price: "$29.99",
        category: "Business",
        level: "Beginner",
        image:
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop",
    },
];

export default function Courses() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCourses = allCourses.filter((course) => {
        const matchesCategory =
            selectedCategory === "All" || course.category === selectedCategory;
        const matchesSearch = course.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Explore <span className="gradient-text">Courses</span>
                </h1>
                <p className="text-gray-400">
                    Discover the perfect course to advance your skills
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Input
                    placeholder="Search courses..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    startContent={
                        <SearchNormal1 size={18} className="text-gray-400" />
                    }
                    variant="bordered"
                    classNames={{
                        inputWrapper:
                            "border-white/10 hover:border-indigo-500/40 bg-white/5",
                        input: "text-white",
                    }}
                    className="max-w-sm"
                />
                <div className="flex gap-2 flex-wrap">
                    {categories.map((cat) => (
                        <Chip
                            key={cat}
                            variant={selectedCategory === cat ? "solid" : "bordered"}
                            color={selectedCategory === cat ? "secondary" : "default"}
                            className={`cursor-pointer transition-all ${selectedCategory === cat
                                    ? ""
                                    : "border-white/10 text-gray-400 hover:border-white/30"
                                }`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </Chip>
                    ))}
                </div>
            </div>

            {/* Results count */}
            <p className="text-gray-500 text-sm mb-6">
                Showing {filteredCourses.length} course
                {filteredCourses.length !== 1 ? "s" : ""}
            </p>

            {/* Courses Grid */}
            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
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
                                    className="absolute top-3 left-3 bg-indigo-500/80 text-white backdrop-blur-sm"
                                >
                                    {course.category}
                                </Chip>
                                <Chip
                                    size="sm"
                                    variant="bordered"
                                    className="absolute top-3 right-3 border-white/20 text-white backdrop-blur-sm text-xs"
                                >
                                    {course.level}
                                </Chip>
                            </div>
                            <CardBody className="p-5">
                                <h3 className="text-white font-semibold text-lg mb-2">
                                    {course.title}
                                </h3>
                                <p className="text-gray-500 text-sm mb-3">
                                    {course.instructor}
                                </p>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-1">
                                        <Star1
                                            size={14}
                                            variant="Bold"
                                            className="text-amber-400"
                                        />
                                        <span className="text-white text-sm font-medium">
                                            {course.rating}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                                        <People size={14} />
                                        <span>{course.students.toLocaleString()} students</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                    <span className="text-indigo-400 font-bold text-lg">
                                        {course.price}
                                    </span>
                                    <Button
                                        size="sm"
                                        className="bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30"
                                    >
                                        Enroll Now
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <SearchNormal1
                        size={48}
                        className="text-gray-600 mx-auto mb-4"
                    />
                    <h3 className="text-white font-semibold text-lg mb-2">
                        No courses found
                    </h3>
                    <p className="text-gray-500 text-sm">
                        Try adjusting your search or filter criteria
                    </p>
                </div>
            )}
        </div>
    );
}
