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
        backgroundImage: `url('/img-4.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Login Form - Centered */}
      <div className="w-full max-w-md p-8 bg-white bg-opacity-90 shadow-lg rounded-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-primary">AdoptAPaw</h1>
          <p className="text-lg text-muted-foreground mb-8">Start your journey here</p>
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="text-3xl font-bold text-foreground text-center">
            Find your perfect companion and make their life
          </h2>
          <p className="text-lg text-muted-foreground text-center">
            Scout from 100+ dog breeds available with us
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
};

export default Index;


