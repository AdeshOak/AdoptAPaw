import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/LoginForm";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("https://frontend-take-home-service.fetch.com/dogs/breeds", {
          credentials: "include"
        });
        if (response.ok) {
          navigate("/search");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('/loginbg-poodle.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Login Form - Centered on the page*/}
      <div className="w-full max-w-md p-8 bg-white bg-opacity-90 shadow-lg rounded-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-primary">AdoptAPaw</h1>
        </div>

        <div className="space-y-2 mb-8">
        <p className="text-lg text-foreground text-center">
          Find your perfect companion & make their life
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Index;


