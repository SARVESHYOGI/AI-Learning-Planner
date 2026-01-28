import { Link } from 'react-router-dom';

const NoPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
            <div className="text-center max-w-lg p-8 rounded-lg shadow-xl bg-white bg-opacity-20 backdrop-blur-md">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <h2 className="text-3xl font-semibold mb-4">Oops! Page Not Found</h2>
                <p className="text-xl mb-6">
                    It seems like the page you are looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-3 text-lg font-semibold text-indigo-600 bg-white rounded-lg shadow-lg transition-all hover:bg-indigo-600 hover:text-white"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default NoPage;
