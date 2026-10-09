import PantallaError from "@/components/PantallaError";

// Next la usa para cualquier URL que no exista.
export default function NotFound() {
  return <PantallaError tipo="noEncontrado" codigo="404" />;
}