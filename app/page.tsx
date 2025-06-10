import "./home.css"
import Hero from "@/components/Hero"
import Benefits from "@/components/Benefits/Benefits"
import WhyUs from "@/components/whyUs"
import FAQ from "@/components/FAQ"
import { Container } from "lucide-react"
import MapEmbed from "@/components/MapEmbed"


export default function Home() {
  return (
    <>
      <Hero />
      <Benefits />
      <FAQ />
      <WhyUs />
      <MapEmbed />

    </>
  )
}
