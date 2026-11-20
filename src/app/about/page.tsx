
import Link from "next/link";

export default function AboutPage() {

    const features = [
        {
            title: "Modern Writing Platform",
            desc: "A clean and fast blogging platform designed for developers to create and share technical content.",
        },
        {
            title: "Share Knowledge",
            desc: "Publish articles, explain your ideas, and help other developers grow.",
        },
        {
            title: "Learn & Grow",
            desc: "Discover new technologies and improve your programming skills through community content.",
        },
    ];


    const technologies = [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "PHP",
        "MySQL",
    ];


    return (

        <main className="min-h-screen bg-[#f7f9fc] text-slate-900">


            {/* HERO */}

            <section className="max-w-7xl mx-auto px-6 pt-16 text-center">

                <h1 className="text-5xl md:text-6xl font-bold">

                    About{" "}

                    <span className="text-blue-600">
                        B-lock
                    </span>

                </h1>


                <p className="max-w-3xl mx-auto mt-6 text-slate-600 leading-7">

                    B-lock is a modern developer blogging platform where
                    programmers can write articles, share knowledge,
                    and discover new technologies.

                </p>

            </section>


            {/* FEATURES */}


            <section className="max-w-7xl mx-auto px-6 py-16">


                <h2 className="text-3xl font-bold text-center">
                    Why B-lock?
                </h2>



                <div className="grid md:grid-cols-3 gap-6 mt-10">


                    {features.map((item)=>(


                        <div
                            key={item.title}
                            className="rounded-3xl border bg-white p-8 shadow-sm hover:shadow-md transition"
                        >

                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-5">

                                <span className="text-blue-600 text-xl">
                                    ✦
                                </span>

                            </div>



                            <h3 className="text-xl font-semibold">
                                {item.title}
                            </h3>



                            <p className="mt-3 text-sm text-slate-600 leading-6">
                                {item.desc}
                            </p>



                        </div>


                    ))}


                </div>


            </section>



            {/* MISSION */}


            <section className="max-w-7xl mx-auto px-6">


                <div className="rounded-3xl bg-linear-to-r from-blue-600 to-indigo-600 p-10 text-white">


                    <h2 className="text-3xl font-bold">
                        Our Mission
                    </h2>



                    <p className="mt-5 max-w-3xl text-blue-100 leading-7">

                        We believe every developer has knowledge worth sharing.
                        B-lock was created to make technical writing simple,
                        beautiful, and accessible for everyone.

                    </p>



                    <Link href="/auth/register">

                        <button
                            className="mt-8 rounded-xl bg-white px-7 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition"
                        >

                            Join Community

                        </button>

                    </Link>



                </div>


            </section>



            {/* TECHNOLOGY STACK */}


            <section className="max-w-7xl mx-auto px-6 py-16">


                <h2 className="text-3xl font-bold text-center">

                    Built With

                </h2>



                <div className="mt-10 flex flex-wrap justify-center gap-4">


                    {technologies.map((tech)=>(


                        <div
                            key={tech}
                            className="rounded-xl border bg-white px-6 py-3 text-sm font-medium shadow-sm"
                        >

                            {tech}

                        </div>


                    ))}



                </div>



            </section>



            {/* CTA */}


            <section className="max-w-7xl mx-auto px-6 pb-16">


                <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">


                    <h2 className="text-3xl font-bold">

                        Ready to share your knowledge?

                    </h2>



                    <p className="mt-3 text-slate-500">

                        Create your account and start publishing your first article.

                    </p>



                    <Link href="/auth/register">


                        <button
                            className="mt-6 rounded-xl bg-blue-600 px-8 py-3 text-white font-semibold hover:bg-blue-700 transition"
                        >

                            Create Account

                        </button>


                    </Link>


                </div>


            </section>



            {/* FOOTER */}


            <footer className="border-t bg-white">


                <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-slate-500">

                    © 2026 B-lock. Built with Next.js & Tailwind CSS.

                </div>


            </footer>

        </main>

    );

}