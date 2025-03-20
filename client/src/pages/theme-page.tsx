import { useState, useEffect } from "react";
import { 
  Palette, 
  Sun, 
  Moon, 
  Type, 
  Check, 
  CircleDot, 
  ArrowLeftRight,
  RefreshCw 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";

export default function ThemePage() {
  const { toast } = useToast();
  const { 
    isDarkMode, 
    setTheme, 
    theme, 
    updateTheme 
  } = useTheme();
  
  // State for theme customization options
  const [appearance, setAppearance] = useState<"light" | "dark">(isDarkMode ? "dark" : "light");
  const [primaryColor, setPrimaryColor] = useState(theme.primaryColor);
  const [fontStyle, setFontStyle] = useState(theme.fontStyle);
  const [borderRadius, setBorderRadius] = useState<number>(parseFloat(theme.borderRadius) || 0.5);
  const [showPreview, setShowPreview] = useState(true);
  
  // Available theme options
  const colorOptions = [
    { name: "Blue", value: "hsl(222.2 47.4% 11.2%)" },
    { name: "Slate", value: "hsl(215.4 16.3% 46.9%)" },
    { name: "Zinc", value: "hsl(240 5.9% 10%)" },
    { name: "Red", value: "hsl(0 72.2% 50.6%)" },
    { name: "Orange", value: "hsl(24.6 95% 53.1%)" },
    { name: "Amber", value: "hsl(38 92.7% 50.2%)" },
    { name: "Yellow", value: "hsl(47.9 95.8% 53.1%)" },
    { name: "Lime", value: "hsl(84.3 74.2% 42.5%)" },
    { name: "Green", value: "hsl(142.1 70.6% 45.3%)" },
    { name: "Emerald", value: "hsl(160 84.1% 39.4%)" },
    { name: "Teal", value: "hsl(181.3 53.9% 40.2%)" },
    { name: "Cyan", value: "hsl(189.5 71.4% 42.2%)" },
    { name: "Sky", value: "hsl(198.6 88.7% 48.4%)" },
    { name: "Indigo", value: "hsl(226.5 70.7% 40.2%)" },
    { name: "Violet", value: "hsl(262.1 83.3% 57.8%)" },
    { name: "Purple", value: "hsl(270 95.2% 43.2%)" },
    { name: "Fuchsia", value: "hsl(292.2 91.4% 72.5%)" },
    { name: "Pink", value: "hsl(330.7 81.9% 55.5%)" },
    { name: "Rose", value: "hsl(349.7 89.2% 60.2%)" },
  ];
  
  const fontOptions = [
    { name: "Default (Inter)", value: "default" },
    { name: "Sans Serif", value: "sans-serif" },
    { name: "Serif", value: "serif" },
    { name: "Monospace", value: "monospace" },
    { name: "Rounded", value: "rounded" },
  ];
  
  // Apply theme changes
  const applyTheme = () => {
    updateTheme({
      primaryColor,
      fontStyle,
      borderRadius: borderRadius.toString(),
    });
    
    setTheme(appearance === "dark");
    
    toast({
      title: "Theme Updated",
      description: "Your theme preferences have been saved.",
    });
  };
  
  // Reset to default theme
  const resetTheme = () => {
    setAppearance("light");
    setPrimaryColor("hsl(222.2 47.4% 11.2%)");
    setFontStyle("default");
    setBorderRadius(0.5);
    
    toast({
      title: "Theme Reset",
      description: "Your theme has been reset to default settings.",
    });
  };
  
  // Update initial values when theme changes
  useEffect(() => {
    setAppearance(isDarkMode ? "dark" : "light");
    setPrimaryColor(theme.primaryColor);
    setFontStyle(theme.fontStyle);
    setBorderRadius(parseFloat(theme.borderRadius) || 0.5);
  }, [isDarkMode, theme]);
  
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Theme Customization Panel */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Theme Customization
                  </h1>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={showPreview}
                      onCheckedChange={setShowPreview}
                      id="preview-mode"
                    />
                    <Label htmlFor="preview-mode" className="text-sm text-gray-500 dark:text-gray-400">
                      Show Preview
                    </Label>
                  </div>
                </div>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Personalize your shopping experience by customizing the appearance of the website.
                </p>
              </div>
              
              <div className="p-6">
                <Tabs defaultValue="appearance" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="appearance" className="flex items-center">
                      <Sun className="mr-2 h-4 w-4" />
                      Appearance
                    </TabsTrigger>
                    <TabsTrigger value="colors" className="flex items-center">
                      <Palette className="mr-2 h-4 w-4" />
                      Colors
                    </TabsTrigger>
                    <TabsTrigger value="typography" className="flex items-center">
                      <Type className="mr-2 h-4 w-4" />
                      Typography
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="appearance" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Mode
                      </h3>
                      <RadioGroup
                        value={appearance}
                        onValueChange={(value) => setAppearance(value as "light" | "dark")}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <RadioGroupItem value="light" id="light-mode" />
                          <Label
                            htmlFor="light-mode"
                            className="flex items-center cursor-pointer"
                          >
                            <Sun className="mr-2 h-4 w-4" />
                            Light Mode
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <RadioGroupItem value="dark" id="dark-mode" />
                          <Label
                            htmlFor="dark-mode"
                            className="flex items-center cursor-pointer"
                          >
                            <Moon className="mr-2 h-4 w-4" />
                            Dark Mode
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Border Radius
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {borderRadius.toFixed(1)}rem
                        </span>
                      </div>
                      <Slider
                        value={[borderRadius]}
                        onValueChange={(value) => setBorderRadius(value[0])}
                        min={0}
                        max={2}
                        step={0.1}
                      />
                      <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>Square</span>
                        <span>Rounded</span>
                        <span>Pill</span>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="colors" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Primary Color
                      </h3>
                      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            className={`relative h-12 rounded-md flex items-center justify-center ${
                              primaryColor === color.value
                                ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-primary"
                                : "hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600"
                            }`}
                            style={{ backgroundColor: color.value }}
                            onClick={() => setPrimaryColor(color.value)}
                            title={color.name}
                          >
                            {primaryColor === color.value && (
                              <Check className="h-4 w-4 text-white" />
                            )}
                          </button>
                        ))}
                      </div>
                      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                        Selected: {colorOptions.find(c => c.value === primaryColor)?.name || "Custom"}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Custom Color
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-12 h-12 rounded-md border border-gray-200 dark:border-gray-700"
                          style={{ backgroundColor: primaryColor }}
                        ></div>
                        <input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="hsl(222.2 47.4% 11.2%)"
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Enter a valid HSL color value (e.g., hsl(222.2 47.4% 11.2%))
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="typography" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Font Style
                      </h3>
                      <RadioGroup
                        value={fontStyle}
                        onValueChange={setFontStyle}
                        className="space-y-3"
                      >
                        {fontOptions.map((font) => (
                          <div key={font.value} className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <RadioGroupItem value={font.value} id={`font-${font.value}`} />
                            <Label
                              htmlFor={`font-${font.value}`}
                              className={`flex-1 cursor-pointer ${
                                font.value === "default" ? "font-sans" :
                                font.value === "sans-serif" ? "font-sans" :
                                font.value === "serif" ? "font-serif" :
                                font.value === "monospace" ? "font-mono" :
                                font.value === "rounded" ? "font-sans" : ""
                              }`}
                            >
                              {font.name}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-8 flex flex-col sm:flex-row sm:justify-end space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button variant="outline" onClick={resetTheme}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset to Default
                  </Button>
                  <Button onClick={applyTheme}>
                    Apply Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Preview Panel */}
          {showPreview && (
            <div className="w-full lg:w-1/3">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden h-full">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Preview
                  </h2>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    See how your customizations will look in real-time.
                  </p>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Preview Elements */}
                  <div className="space-y-4"
                    style={{
                      fontFamily: 
                        fontStyle === "default" ? "'Inter', sans-serif" :
                        fontStyle === "sans-serif" ? "Arial, sans-serif" :
                        fontStyle === "serif" ? "Georgia, serif" :
                        fontStyle === "monospace" ? "monospace" :
                        fontStyle === "rounded" ? "'Comic Sans MS', cursive" : 
                        "'Inter', sans-serif"
                    }}
                  >
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Typography
                    </h3>
                    
                    <div className="space-y-2">
                      <p className="text-2xl font-bold" style={{ color: primaryColor }}>
                        Heading Text
                      </p>
                      <p className="text-base text-gray-900 dark:text-white">
                        This is how your regular text will appear.
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Secondary text and descriptions look like this.
                      </p>
                      <div>
                        <a href="#" className="text-base font-medium" style={{ color: primaryColor }}>
                          Links will look like this
                        </a>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6">
                      Components
                    </h3>
                    
                    <div className="space-y-4">
                      <button 
                        className="px-4 py-2 font-medium text-white rounded-md"
                        style={{ 
                          backgroundColor: primaryColor,
                          borderRadius: `${borderRadius}rem`
                        }}
                      >
                        Primary Button
                      </button>
                      
                      <div className="flex space-x-2">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          Selected Item
                        </span>
                      </div>
                      
                      <div 
                        className="p-4 border rounded-md"
                        style={{ 
                          borderRadius: `${borderRadius}rem`,
                          borderColor: appearance === "light" ? "#e5e7eb" : "#374151"
                        }}
                      >
                        <p className="text-sm text-gray-900 dark:text-white">
                          Card and container elements will use your border radius setting.
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: primaryColor }}
                        ></div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          Accent Elements
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
