const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 p-4 pb-0 pt-3 text-white">
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; 2023 Your Blog. All rights reserved.</p>
        <div className="mt-1">
          <a
            href="#"
            className="mx-2 text-gray-400 transition duration-300 hover:text-white"
          >
            Privacy Policy
          </a>
          <span className="text-gray-400">|</span>
          <a
            href="#"
            className="mx-2 text-gray-400 transition duration-300 hover:text-white"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
