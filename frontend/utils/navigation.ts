import dashboardIcon from "../public/dashboardIcon.svg";
import clientIcon from "../public/clientIcon.svg";
import siteIcon from "../public/siteIcon.svg";
import jobIcon from "../public/jobIcon.svg";
import fixedIcon from "../public/clientIcon.svg";
import userIcon from "../public/users.svg";
import logIcon from "../public/log.svg";
import turnAroundExecutionIcon from "../public/turnaroundexecution.svg";

export const navItems = {
  admin: [
    { label: "Dashboard", href: "/dashboard", icon: dashboardIcon },
    { label: "Clients", href: "/clients", icon: clientIcon },
    { label: "Sites", href: "/sites", icon: siteIcon },
    { label: "Jobs", href: "/jobs", icon: jobIcon },
    {
      label: "Fixed Equipment",
      href: "/fixedequipmentsummary",
      icon: fixedIcon,
    },
    { label: "Users", href: "/users", icon: userIcon },
    { label: "ActivityLog", href: "/activitylog", icon: logIcon },
    {
      label: "Turn Around Execution",
      href: "/turnaroundexecution",
      icon: turnAroundExecutionIcon,
    },
  ],
  user: [
    { label: "Dashboard", href: "/dashboard", icon: dashboardIcon },
    {
      label: "Fixed Equipment",
      href: "/fixedequipmentsummary",
      icon: fixedIcon,
    },
    {
      label: "Turn Around Execution",
      href: "/turnaroundexecution",
      icon: turnAroundExecutionIcon,
    },
  ],
};
