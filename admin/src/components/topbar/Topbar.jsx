import React from "react";
import "./topbar.css";
import { NotificationsNone, Language, Settings } from "@material-ui/icons";
import { useSelector } from "react-redux";

export default function Topbar() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">SHOPLOGO</span>
        </div>
        <div className="topRight">
          <div className="topbarIconContainer">
            <NotificationsNone />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Language />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Settings />
          </div>
          <img
            src={
              currentUser?.img ||
              "https://www.kindpng.com/picc/m/22-223863_no-avatar-png-circle-transparent-png.png"
            }
            alt=""
            className="topAvatar"
          />
        </div>
      </div>
    </div>
  );
}
