'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, ChevronRight, Upload, Apple, Egg, Carrot, Milk, Pizza, Edit2 } from "lucide-react"
import Image from 'next/image'
import SparklesText from './magicui/sparkles-text'
import { Button } from "@/components/ui/button"
import Confetti from './magicui/confetti'
import Globe_on from './Globe'
import AnimatedCircularProgressBar from './magicui/animated-circular-progress-bar'

type NutritionInfo = {
  calories: number;
  carbohydrates: number;
  protein: number;
  fat: number;
  fiber: number;
  vitamins: string[];
}

export default function CalorieCounter() {
  const [image, setImage] = useState<string | null>(null)
  const [processed, setProcessed] = useState(false)
  const [weight, setWeight] = useState(54.1)
  const [editingWeight, setEditingWeight] = useState(false)
  const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo | null>(null)
  const [imageUploaded, setImageUploaded] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
        setProcessed(false)
        setNutritionInfo(null)
        setImageUploaded(true)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProcess = async () => {
    if (!image) return;

    setIsLoading(true)
    setError(null)
    console.log('Starting image processing');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image }),
      });

      if (!response.ok) {
        throw new Error('Failed to process image');
      }

      const data = await response.json();
      console.log('Received data from server:', data);

      if (data.error) {
        setError(data.error);
      } else {
        setNutritionInfo(data);
        setProcessed(true);
        setShowConfetti(true);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setError('An error occurred while processing the image. Please try again.');
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 5000) // Hide confetti after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(parseFloat(e.target.value))
  }

  const toggleWeightEdit = () => {
    setEditingWeight(!editingWeight)
  }

  return (
    <div className="bg-blue-50 min-h-screen p-4 sm:p-8">
      {showConfetti && <Confetti />}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl p-4 sm:p-8 shadow-lg">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <a href="/" className="text-2xl font-bold mb-4 sm:mb-0">CALORIECAM</a>
          <nav className="flex flex-wrap justify-center space-x-2 sm:space-x-4">
            <a href="#" className="text-gray-600 hover:text-black transition-colors duration-200 mb-2 sm:mb-0">Diary</a>
            <a href="#" className="text-gray-600 hover:text-black transition-colors duration-200 mb-2 sm:mb-0">Recipes</a>
            <a href="#" className="text-gray-600 hover:text-black transition-colors duration-200 mb-2 sm:mb-0">Fasting</a>
          </nav>
        </header>

        <main>
          {!imageUploaded ? (
            <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
              <div className="mb-6 sm:mb-0 w-full sm:w-1/2">
                <SparklesText text="CALORIE COUNTER" />
                <br />
                <p className="text-gray-600 mb-4">Manage Your Daily Food Diary,<br />Track Your Activities<br />And Lose Weight Successfully</p>
                <Button asChild>
                  <label htmlFor="file-upload" className="flex items-center cursor-pointer">
                    Upload an image <ArrowRight className="ml-2" />
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/jpeg, image/png"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </Button>
              </div>
              <div className="hidden sm:flex justify-end items-center w-1/2">
                <Image src="/8810176.jpg" alt="Uploaded preview" width={500} height={300} className="w-full h-auto" />
              </div>
            </div>
          ) : (
            <>
              {image && !processed && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4">Food Preview</h3>
                  <Image
                    src={image}
                    alt="Uploaded preview"
                    className="w-full max-w-md mx-auto mb-4 rounded-lg shadow-md"
                    width={500}
                    height={300}
                  />
                  <Button
                    onClick={handleProcess}
                    className="flex items-center mx-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Process Image'} <Upload className="ml-2" />
                  </Button>
                </div>
              )}

              {processed && nutritionInfo && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-100 p-6 rounded-2xl flex flex-col items-center justify-center">
                    <Pizza className="w-24 h-24 text-yellow-500 mb-4" />
                    <p className="text-4xl font-bold">{nutritionInfo.calories} kcal</p>
                    <p className="text-gray-600">Estimated calories</p>
                  </div>

                  <div className="bg-gray-100 p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Nutrition</h3>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-center">
                        <Apple className="w-6 h-6 mr-2 text-red-500" />
                        <span className="flex-grow">Carbohydrates</span>
                        <span>{nutritionInfo.carbohydrates}g</span>
                      </li>
                      <li className="flex items-center">
                        <Egg className="w-6 h-6 mr-2 text-yellow-500" />
                        <span className="flex-grow">Protein</span>
                        <span>{nutritionInfo.protein}g</span>
                      </li>
                      <li className="flex items-center">
                        <Milk className="w-6 h-6 mr-2 text-blue-500" />
                        <span className="flex-grow">Fat</span>
                        <span>{nutritionInfo.fat}g</span>
                      </li>
                      <li className="flex items-center">
                        <Carrot className="w-6 h-6 mr-2 text-orange-500" />
                        <span className="flex-grow">Fiber</span>
                        <span>{nutritionInfo.fiber}g</span>
                      </li>
                      <li className="flex items-center">
                        <Apple className="w-6 h-6 mr-2 text-green-500" />
                        <span className="flex-grow">Vitamins</span>
                        <span>{nutritionInfo.vitamins.join(', ')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}

          {!imageUploaded && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-100 p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Calorie intake</h3>
                  <Button variant="link" size="sm" asChild>
                    <a href="#" className="text-blue-500 hover:text-blue-600">More</a>
                  </Button>
                </div>
                <div className="flex justify-center items-center">
                  <div className="relative w-32 h-32">

                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <AnimatedCircularProgressBar
                        value={nutritionInfo ? (2100 / nutritionInfo.calories) : 0}
                        max={100}
                        min={0}
                        gaugePrimaryColor="black"
                        gaugeSecondaryColor="blue"
                      />
                      {/* <p className="text-3xl font-bold"> {nutritionInfo ? (2100 / nutritionInfo.calories) : 0}</p>
                      <p className="text-sm text-gray-600">Remaining</p> */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Measurements</h3>
                  <Button variant="link" size="sm" asChild>
                    <a href="#" className="text-blue-500 hover:text-blue-600">More</a>
                  </Button>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <span>Weight</span>
                    <Button variant="ghost" size="sm" onClick={toggleWeightEdit}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {editingWeight ? (
                    <div className="flex items-center mt-2">
                      <input
                        type="number"
                        value={weight}
                        onChange={handleWeightChange}
                        className="text-3xl font-bold w-24 bg-white border rounded px-2 py-1"
                        step="0.1"
                      />
                      <span className="text-3xl font-bold ml-2">kg</span>
                    </div>
                  ) : (
                    <p className="text-3xl font-bold">{weight.toFixed(1)} kg</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {processed && (
            <div className="bg-gray-100 p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Recipes</h3>
                <ChevronRight className="text-gray-400" />
              </div>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-yellow-400 rounded-full mr-2"></span>
                  Breakfast, Lunch, Dinner
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-green-400 rounded-full mr-2"></span>
                  High Protein
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-blue-400 rounded-full mr-2"></span>
                  Low Carb, Low Calorie
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-red-400 rounded-full mr-2"></span>
                  Vegetarian
                </li>
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
