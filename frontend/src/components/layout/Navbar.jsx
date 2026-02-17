import logo from "../../assets/logo.png";
import Button from "../ui/Button";
import { Compass, GraduationCap, Play, Settings } from "lucide-react";

//Join icon (Creado manual) USAR useLocation de REACT ROUTER

const JoinColorIcon = () => (
  <div className="grid grid-cols-2 gap-[2px] w-4 h-4 flex-shrink-0">
    <div className="bg-red-500 rounded-[2px]" />
    <div className="bg-blue-500 rounded-[2px]" />
    <div className="bg-yellow-400 rounded-[2px]" />
    <div className="bg-green-500 rounded-[2px]" />
  </div>
);

//Data 

const Nav_items = [
  { label: "Discover", Icon: Compass, active: false }, //aca se deberia usar useLocation de React ROUTER
  { label: "Learn", Icon: GraduationCap, active: false },
  { label: "Present", Icon: Play, active: false },
  { label: "Make", Icon: Settings, active: true }, // Esto debe cambiarse a que sea active dependiendo de el page donde este actualmente
];

//Navbar

export default function Navbar() {
  return (
    <nav className="bg-[#fde8e0] px-6 h-16 flex items-center justify-between">
      {/*Logo*/}
      <img
        src={logo}
        alt="QHit logo"
        className="h-24 w-auto flex-shrink-0 object-contain pr-4"
      />
      {/*Links*/}
      <div className="flex items-center gap-2 flex-1">
        {Nav_items.map(({ label, Icon, active }) => (
          <Button
            key={label}
            variant="nav"
            className={active ? "ring-2 ring-red-400 ring-offset-0" : ""}
          >
            <Icon size={15} strokeWidth={2} />
            {label}
          </Button>
        ))}
        {/*join*/}
        <Button variant="nav">
          <JoinColorIcon />
          Join
        </Button>
      </div>
      {/*Sign up*/}
      <Button variant="signup">Sign up</Button>
    </nav>
  );
}
