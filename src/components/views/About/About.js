import Image from "next/image";

const About = () => {
  return (
    <div className="mt-8 p-6">
      <h1 className="text-xl text-gray-600 font-semibold mt-4">
        Teknologi Yang Digunakan :
      </h1>
      <div className="flex mt-4 gap-4">
        <div className="bg-gray-300  p-5 rounded-2xl">
          <Image
            src="/next.svg"
            alt="nextjs"
            className="hover:scale-110 transition-all"
            width={200}
            height={100}
          />
        </div>
        <p className="self-center text-2xl font-semibold text-gray-500">+</p>
        <div className="bg-gray-300 p-4 rounded-2xl">
          <Image
            src="/ui.svg"
            alt="nextjs"
            width={50}
            height={30}
            className="hover:scale-110 transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
