import { SVGProps } from 'react';

import Accessibility from '../../assets/images/accessibility.svg';
import ArrowBrandCurved from '../../assets/images/arrow-brand-curved.svg';
import ArrowBrandStraight from '../../assets/images/arrow-brand-straight.svg';
import ArrowCurved from '../../assets/images/arrow-curved.svg';
import ArrowUp from '../../assets/images/arrow-up.svg';
import AVC from '../../assets/images/avc.svg';
import AVCDetails from '../../assets/images/avc-details.svg';
import Bookmark from '../../assets/images/bookmark.svg';
import Budgeting from '../../assets/images/budgeting.svg';
import BurgerIcon from '../../assets/images/burger.svg';
import BurgerClose from '../../assets/images/burger-close.svg';
import BurgerIconCurved from '../../assets/images/burger-curved.svg';
import Calculator from '../../assets/images/calculator.svg';
import CalendarIcon from '../../assets/images/calendar.svg';
import Checklist from '../../assets/images/checklist.svg';
import Chevron from '../../assets/images/chevron.svg';
import ChevronDown from '../../assets/images/chevron-down-icon.svg';
import ChevronLeft from '../../assets/images/chevron-left.svg';
import ChevronRight from '../../assets/images/chevron-right.svg';
import Clock from '../../assets/images/clock.svg';
import Close from '../../assets/images/close.svg';
import CloseIcon from '../../assets/images/close-icon.svg';
import ClosePink from '../../assets/images/close-pink.svg';
import CloseRed from '../../assets/images/close-red.svg';
import Costs from '../../assets/images/costs.svg';
import DBDetails from '../../assets/images/db-details.svg';
import DCDetails from '../../assets/images/dc-details.svg';
import DefinedBenefit from '../../assets/images/defined-benefit.svg';
import DefinedContribution from '../../assets/images/defined-contribution.svg';
import Download from '../../assets/images/download.svg';
import Edit from '../../assets/images/edit.svg';
import EmergencySavings from '../../assets/images/emergency_savings.svg';
import England from '../../assets/images/england.svg';
import EstatePlanning from '../../assets/images/estate_planning.svg';
import Facebook from '../../assets/images/facebook.svg';
import FaceToFace from '../../assets/images/facetoface.svg';
import HandShake from '../../assets/images/hand-shake.svg';
import Home from '../../assets/images/home.svg';
import Hybrid from '../../assets/images/hybrid.svg';
import HybridDetails from '../../assets/images/hybrid-details.svg';
import Hyphen from '../../assets/images/hyphen.svg';
import IncomeProtection from '../../assets/images/income_protection.svg';
import InfoIcon from '../../assets/images/info-icon.svg';
import LinkArrow from '../../assets/images/link-arrow.svg';
import LinkedPension from '../../assets/images/linked-pension.svg';
import LinkedPensionDetail from '../../assets/images/linked-pension-detail.svg';
import LogoIcon from '../../assets/images/logo.svg';
import LogoCompactIcon from '../../assets/images/logo-compact.svg';
import LogoCompactCy from '../../assets/images/logo-compact-cy.svg';
import LogoCyIcon from '../../assets/images/logo-cy.svg';
import LumpSum from '../../assets/images/lump-sum.svg';
import Mail from '../../assets/images/mail.svg';
import Minus from '../../assets/images/minus.svg';
import NorthernIreland from '../../assets/images/northern-ireland.svg';
import Online from '../../assets/images/online.svg';
import Planning from '../../assets/images/planning.svg';
import Plus from '../../assets/images/plus.svg';
import PlusVariant from '../../assets/images/plus-variant.svg';
import PreventingDebt from '../../assets/images/preventing_debt.svg';
import Profile from '../../assets/images/profile.svg';
import Savings from '../../assets/images/savings.svg';
import Scotland from '../../assets/images/scotland.svg';
import SearchIcon from '../../assets/images/search.svg';
import SearchCloseIcon from '../../assets/images/search-close.svg';
import TelephoneSmall from '../../assets/images/small-telephone.svg';
import Spinner from '../../assets/images/spinner.svg';
import SpinnerMHPD from '../../assets/images/spinner-mhpd.svg';
import SpinnerMoneyhelper from '../../assets/images/spinner-moneyhelper.svg';
import StatePension from '../../assets/images/state-pension.svg';
import Telephone from '../../assets/images/telephone.svg';
import Tick from '../../assets/images/tick.svg';
import TickGreen from '../../assets/images/tick-green.svg';
import TickSquare from '../../assets/images/tick-square.svg';
import Timeline from '../../assets/images/timeline.svg';
import Twitter from '../../assets/images/twitter.svg';
import W3C from '../../assets/images/w3c.svg';
import Wales from '../../assets/images/wales.svg';
import Warning from '../../assets/images/warning.svg';
import WarningSquare from '../../assets/images/warning-square.svg';
import WebChat from '../../assets/images/webchat.svg';
import WebForm from '../../assets/images/webform.svg';
import Whatsapp from '../../assets/images/whatsapp.svg';
import XClose from '../../assets/images/x-close.svg';
import XDark from '../../assets/images/x-dark.svg';
import XFilter from '../../assets/images/x-filter.svg';
import Youtube from '../../assets/images/youtube.svg';

export enum IconType {
  ACCESSIBILITY = 'accessibility',
  ARROW_CURVED = 'arrow-curved',
  ARROW_BRAND_CURVED = 'arrow-brand-curved',
  ARROW_BRAND_STRAIGHT = 'arrow-brand-straight',
  ARROW_UP = 'arrow-up',
  AVC = 'avc',
  AVC_DETAILS = 'avc-details',
  BOOKMARK = 'bookmark',
  BUDGETING = 'budgeting',
  BURGER_CLOSE = 'burger-close',
  BURGER_ICON = 'burger-icon',
  BURGER_ICON_CURVED = 'burger-icon-curved',
  CALENDAR = 'calendar',
  CALCULATOR = 'calculator',
  CHECKLIST = 'checklist',
  CHEVRON = 'chevron',
  CHEVRON_DOWN = 'chevron-down',
  CHEVRON_LEFT = 'chevron-left',
  CHEVRON_RIGHT = 'chevron-right',
  CLOCK = 'clock',
  CLOSE = 'close',
  CLOSE_ICON = 'close-icon',
  CLOSE_RED = 'close-red',
  CLOSE_PINK = 'close-pink',
  COSTS = 'costs',
  DEFINED_BENEFIT = 'defined-benefit',
  DEFINED_CONTRIBUTION = 'defined-contribution',
  DB_DETAILS = 'db-details',
  DC_DETAILS = 'dc-details',
  DOWNLOAD = 'download',
  EDIT = 'edit',
  EMERGENCY_SAVINGS = 'emergency-savings',
  ENGLAND = 'england',
  ESTATE_PLANNING = 'estate-planning',
  FACEBOOK = 'facebook',
  FACE_TO_FACE = 'face-to-face',
  HAND_SHAKE = 'hand-shake',
  HOME = 'home',
  HYBRID = 'hybrid',
  HYBRID_DETAILS = 'hybrid-details',
  HYPHEN = 'hyphen',
  INCOME_PROTECTION = 'income-protection',
  INFO_ICON = 'info-icon',
  LINK_ARROW = 'link-arrow',
  LINKED_PENSION = 'linked-pension',
  LINKED_PENSION_DETAIL = 'linked-pension-detail',
  LOGO_COMPACT_CY = 'logo-compact-cy',
  LOGO_COMPACT_ICON = 'logo-compact-icon',
  LOGO_CY_ICON = 'logo-cy-icon',
  LOGO_ICON = 'logo-icon',
  LUMP_SUM = 'lump-sum',
  MAIL = 'mail',
  MINUS = 'minus',
  NORTHERN_IRELAND = 'northern-ireland',
  ONLINE = 'online',
  PLANNING = 'planning',
  PLUS = 'plus',
  PLUS_VARIANT = 'plus-variant',
  PREVENTING_DEBT = 'preventing-debt',
  PROFILE = 'profile',
  SAVINGS = 'savings',
  SCOTLAND = 'scotland',
  SEARCH_CLOSE_ICON = 'search-close-icon',
  SEARCH_ICON = 'search-icon',
  SPINNER_MHPD = 'spinner-mhpd',
  SPINNER_MONEYHELPER = 'spinner-moneyhelper',
  SPINNER = 'spinner',
  STATE_PENSION = 'state-pension',
  TELEPHONE = 'telephone',
  TELEPHONE_SMALL = 'telephone-small',
  TICK = 'tick',
  TICK_SQUARE = 'tick-square',
  TICK_GREEN = 'tick-green',
  TIMELINE = 'timeline',
  TWITTER = 'twitter',
  W3C = 'w3c',
  WALES = 'wales',
  WARNING = 'warning',
  WARNING_SQUARE = 'warning-square',
  WEB_CHAT = 'web-chat',
  WEB_FORM = 'web-form',
  WHATSAPP = 'whatsapp',
  X_CLOSE = 'x-close',
  X_FILTER = 'x-filter',
  YOUTUBE = 'youtube',
  X_DARK = 'x-dark',
}

const map = {
  [IconType.ACCESSIBILITY]: Accessibility,
  [IconType.ARROW_CURVED]: ArrowCurved,
  [IconType.ARROW_BRAND_CURVED]: ArrowBrandCurved,
  [IconType.ARROW_BRAND_STRAIGHT]: ArrowBrandStraight,
  [IconType.ARROW_UP]: ArrowUp,
  [IconType.AVC]: AVC,
  [IconType.AVC_DETAILS]: AVCDetails,
  [IconType.BOOKMARK]: Bookmark,
  [IconType.BUDGETING]: Budgeting,
  [IconType.BURGER_CLOSE]: BurgerClose,
  [IconType.BURGER_ICON]: BurgerIcon,
  [IconType.BURGER_ICON_CURVED]: BurgerIconCurved,
  [IconType.CALENDAR]: CalendarIcon,
  [IconType.CALCULATOR]: Calculator,
  [IconType.CHECKLIST]: Checklist,
  [IconType.CHEVRON]: Chevron,
  [IconType.CHEVRON_DOWN]: ChevronDown,
  [IconType.CHEVRON_LEFT]: ChevronLeft,
  [IconType.CHEVRON_RIGHT]: ChevronRight,
  [IconType.CLOCK]: Clock,
  [IconType.CLOSE]: Close,
  [IconType.CLOSE_ICON]: CloseIcon,
  [IconType.CLOSE_RED]: CloseRed,
  [IconType.CLOSE_PINK]: ClosePink,
  [IconType.COSTS]: Costs,
  [IconType.DEFINED_BENEFIT]: DefinedBenefit,
  [IconType.DEFINED_CONTRIBUTION]: DefinedContribution,
  [IconType.DB_DETAILS]: DBDetails,
  [IconType.DC_DETAILS]: DCDetails,
  [IconType.DOWNLOAD]: Download,
  [IconType.EDIT]: Edit,
  [IconType.EMERGENCY_SAVINGS]: EmergencySavings,
  [IconType.ENGLAND]: England,
  [IconType.ESTATE_PLANNING]: EstatePlanning,
  [IconType.FACEBOOK]: Facebook,
  [IconType.FACE_TO_FACE]: FaceToFace,
  [IconType.HAND_SHAKE]: HandShake,
  [IconType.HOME]: Home,
  [IconType.HYBRID]: Hybrid,
  [IconType.HYBRID_DETAILS]: HybridDetails,
  [IconType.HYPHEN]: Hyphen,
  [IconType.INCOME_PROTECTION]: IncomeProtection,
  [IconType.INFO_ICON]: InfoIcon,
  [IconType.LINK_ARROW]: LinkArrow,
  [IconType.LINKED_PENSION]: LinkedPension,
  [IconType.LINKED_PENSION_DETAIL]: LinkedPensionDetail,
  [IconType.LOGO_COMPACT_CY]: LogoCompactCy,
  [IconType.LOGO_COMPACT_ICON]: LogoCompactIcon,
  [IconType.LOGO_CY_ICON]: LogoCyIcon,
  [IconType.LOGO_ICON]: LogoIcon,
  [IconType.LUMP_SUM]: LumpSum,
  [IconType.MAIL]: Mail,
  [IconType.MINUS]: Minus,
  [IconType.NORTHERN_IRELAND]: NorthernIreland,
  [IconType.ONLINE]: Online,
  [IconType.PLANNING]: Planning,
  [IconType.PLUS]: Plus,
  [IconType.PLUS_VARIANT]: PlusVariant,
  [IconType.PREVENTING_DEBT]: PreventingDebt,
  [IconType.PROFILE]: Profile,
  [IconType.SAVINGS]: Savings,
  [IconType.SCOTLAND]: Scotland,
  [IconType.SEARCH_CLOSE_ICON]: SearchCloseIcon,
  [IconType.SEARCH_ICON]: SearchIcon,
  [IconType.SPINNER_MHPD]: SpinnerMHPD,
  [IconType.SPINNER_MONEYHELPER]: SpinnerMoneyhelper,
  [IconType.SPINNER]: Spinner,
  [IconType.STATE_PENSION]: StatePension,
  [IconType.TELEPHONE]: Telephone,
  [IconType.TELEPHONE_SMALL]: TelephoneSmall,
  [IconType.TICK]: Tick,
  [IconType.TICK_SQUARE]: TickSquare,
  [IconType.TICK_GREEN]: TickGreen,
  [IconType.TIMELINE]: Timeline,
  [IconType.TWITTER]: Twitter,
  [IconType.W3C]: W3C,
  [IconType.WALES]: Wales,
  [IconType.WARNING]: Warning,
  [IconType.WARNING_SQUARE]: WarningSquare,
  [IconType.WEB_CHAT]: WebChat,
  [IconType.WEB_FORM]: WebForm,
  [IconType.WHATSAPP]: Whatsapp,
  [IconType.X_CLOSE]: XClose,
  [IconType.X_FILTER]: XFilter,
  [IconType.YOUTUBE]: Youtube,
  [IconType.X_DARK]: XDark,
};

interface Props extends SVGProps<SVGElement> {
  type: IconType;
  width?: number;
  height?: number;
  className?: string;
}

export const Icon = ({ type, width, height, className, ...props }: Props) => {
  const Component = map[type];
  return (
    <Component
      style={
        (width || height) && {
          maxWidth: width,
          maxHeight: height,
          minWidth: width,
          minHeight: height,
        }
      }
      className={className ?? ''}
      {...props}
    />
  );
};
