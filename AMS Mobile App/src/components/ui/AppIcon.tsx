import {
  BadgeCheck,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  ClipboardList,
  Clock3,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  HandCoins,
  Home,
  Landmark,
  Laptop,
  LockKeyhole,
  LogOut,
  LucideIcon,
  Mail,
  MapPin,
  Menu,
  MessageCircleQuestion,
  Phone,
  Plus,
  ShieldCheck,
  User,
  WalletCards,
  X,
} from "lucide-react-native";
import { colors } from "../../theme";

const icons = {
  home: Home,
  user: User,
  menu: Menu,
  bell: Bell,
  plus: Plus,
  x: X,
  check: CheckCircle2,
  clock: Clock3,
  calendar: CalendarDays,
  file: FileText,
  profile: CircleUserRound,
  request: ClipboardList,
  ticket: MessageCircleQuestion,
  loan: HandCoins,
  salary: WalletCards,
  work: BriefcaseBusiness,
  laptop: Laptop,
  chevronRight: ChevronRight,

  mail: Mail,
  phone: Phone,
  building: Building2,
  bank: Landmark,
  card: CreditCard,
  logout: LogOut,
  shield: ShieldCheck,
  badge: BadgeCheck,
  location: MapPin,

  lock: LockKeyhole,
  eye: Eye,
  eyeOff: EyeOff,
};

export type IconName = keyof typeof icons;

type AppIconProps = {
  name: IconName;
  size?: number;
  color?: keyof typeof colors;
  strokeWidth?: number;
};

export function AppIcon({
  name,
  size = 22,
  color = "text",
  strokeWidth = 2,
}: AppIconProps) {
  const Icon = icons[name] as LucideIcon;

  return <Icon size={size} color={colors[color]} strokeWidth={strokeWidth} />;
}
