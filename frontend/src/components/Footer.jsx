import { FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-800 bg-gray-950 py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-col justify-between items-center gap-4">

        {/* Social Icons */}
        <div className="flex items-center gap-6">
          <a
            href="https://www.linkedin.com/in/atharvaghorpade/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition-colors text-xl"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
          
          <a
            href="https://github.com/AtharvaGhorpade2405"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors text-xl"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;