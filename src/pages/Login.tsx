
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, KeyRoundIcon, MailIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    securityQuestion: "What was your first pet's name?",
    securityAnswer: "",
    confirmPassword: "",
    rememberMe: false
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  // For tabbed interface
  const [activeTab, setActiveTab] = useState("login");

  // Check if user is already logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
      navigate("/");
    }
    
    // Start the intro animation sequence
    const introTimer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);
    
    return () => clearTimeout(introTimer);
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle login form submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: any) => u.email === formData.email && u.password === formData.password);
    
    if (user) {
      // Call login function from AuthContext to set current user
      login({
        email: user.email,
        securityQuestion: user.securityQuestion,
        securityAnswer: user.securityAnswer
      });
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate("/");
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  // Handle signup form submission
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    // Get existing users or initialize empty array
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    // Check if user already exists
    if (users.some((u: any) => u.email === formData.email)) {
      toast({
        title: "Email already registered",
        description: "Please use a different email or login instead",
        variant: "destructive",
      });
      return;
    }
    
    // Create new user
    const newUser = {
      email: formData.email,
      password: formData.password,
      securityQuestion: formData.securityQuestion,
      securityAnswer: formData.securityAnswer,
    };
    
    // Add user to array and save to localStorage
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    
    // Log in the newly created user
    login({
      email: newUser.email,
      securityQuestion: newUser.securityQuestion,
      securityAnswer: newUser.securityAnswer
    });
    
    toast({
      title: "Account created successfully",
      description: "Welcome to RetinaRisk!",
    });
    
    navigate("/");
  };

  // Handle forgot password
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [foundUser, setFoundUser] = useState<any>(null);
  
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find user by email
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: any) => u.email === resetEmail);
    
    if (!user) {
      toast({
        title: "User not found",
        description: "No account with this email exists",
        variant: "destructive",
      });
      return;
    }
    
    setFoundUser(user);
  };
  
  const handleCheckAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (foundUser && securityAnswer.toLowerCase() === foundUser.securityAnswer.toLowerCase()) {
      toast({
        title: "Security answer correct",
        description: "You can now reset your password",
      });
    } else {
      toast({
        title: "Incorrect answer",
        description: "The security answer is incorrect",
        variant: "destructive",
      });
      return;
    }
  };
  
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }
    
    // Update user password
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((u: any) => {
      if (u.email === foundUser.email) {
        return { ...u, password: newPassword };
      }
      return u;
    });
    
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    toast({
      title: "Password reset successful",
      description: "You can now login with your new password",
    });
    
    setForgotMode(false);
    setFoundUser(null);
    setResetEmail("");
    setSecurityAnswer("");
    setNewPassword("");
  };
  
  // Create a function to switch tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center items-center relative overflow-hidden p-4">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-brand-blue/5 z-0"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-blue/10 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl"></div>
      
      {/* Intro content */}
      <div 
        className={`max-w-4xl mx-auto text-center transition-all duration-1000 p-8 ${
          showIntro ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-16 absolute"
        }`}
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-brand-blue leading-tight">
          Your Eyes Reveal More Than Vision — <br />
          Discover What Your Retina Says About Your Heart Health
        </h1>
        <p className="text-gray-600 md:text-xl max-w-3xl mx-auto">
          Learn how retinal imaging helps assess your risk of heart disease. Backed by AI and medical research, 
          this non-invasive tool provides early warnings to protect your heart health.
        </p>
      </div>
      
      {/* Auth content */}
      <div 
        className={`w-full max-w-md z-10 transition-all duration-1000 ${
          !showIntro ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16 absolute"
        }`}
      >
        {forgotMode ? (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>
                Enter your email and answer your security question to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!foundUser ? (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <div className="relative">
                      <MailIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Find Account</Button>
                </form>
              ) : !securityAnswer ? (
                <form onSubmit={handleCheckAnswer} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Security Question</Label>
                    <p className="text-sm text-muted-foreground border p-2 rounded-md bg-muted">
                      {foundUser.securityQuestion}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="security-answer">Your Answer</Label>
                    <Input
                      id="security-answer"
                      type="text"
                      value={securityAnswer}
                      onChange={(e) => setSecurityAnswer(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Verify Answer</Button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <KeyRoundIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Reset Password</Button>
                </form>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="link" 
                className="w-full" 
                onClick={() => {
                  setForgotMode(false);
                  setFoundUser(null);
                  setResetEmail("");
                  setSecurityAnswer("");
                  setNewPassword("");
                }}
              >
                Back to Login
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>Sign in to your RetinaRisk account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <MailIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <div className="relative">
                        <KeyRoundIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          className="pl-10 pr-10"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="remember"
                        name="rememberMe"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                      />
                      <label htmlFor="remember" className="text-sm text-gray-600">
                        Remember me
                      </label>
                    </div>
                    <Button type="submit" className="w-full">Sign In</Button>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button 
                    variant="link" 
                    onClick={() => setForgotMode(true)} 
                    className="w-full"
                  >
                    Forgot your password?
                  </Button>
                  <p className="text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto font-normal text-sm underline"
                      onClick={() => handleTabChange("signup")}
                    >
                      Create an account
                    </Button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>Join RetinaRisk to access all features</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <MailIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <KeyRoundIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          className="pl-10 pr-10"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="security-question">Security Question</Label>
                      <select
                        id="security-question"
                        name="securityQuestion"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.securityQuestion}
                        onChange={handleChange as any}
                        required
                      >
                        <option value="What was your first pet's name?">What was your first pet's name?</option>
                        <option value="In which city were you born?">In which city were you born?</option>
                        <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                        <option value="What was the name of your first school?">What was the name of your first school?</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="security-answer">Security Answer</Label>
                      <Input
                        id="security-answer"
                        name="securityAnswer"
                        type="text"
                        value={formData.securityAnswer}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">Create Account</Button>
                  </form>
                </CardContent>
                <CardFooter>
                  <p className="text-center text-sm text-gray-600 w-full">
                    Already have an account?{" "}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto font-normal text-sm underline"
                      onClick={() => handleTabChange("login")}
                    >
                      Sign in
                    </Button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Login;
