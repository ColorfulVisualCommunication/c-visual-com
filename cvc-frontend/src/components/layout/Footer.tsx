export default function Footer() {
  return (
    <footer className="bg-brand-dark border-t border-primary py-4 text-center text-gray-400">
      <div>
        &copy; {new Date().getFullYear()} Colourful Visual Communication. All rights reserved.
      </div>
    </footer>
  );
}