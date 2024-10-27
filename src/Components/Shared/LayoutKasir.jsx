import React from "react";
import { Outlet } from "react-router-dom"
import TabsKasir from "./TabsKasir"

export default function Layout() {
    return (
        <div className="flex flex-row bg-[#FFFFFF] min-w-min min-h-screen ">
                <TabsKasir />
                <div className="flex-1">
                <div> <Outlet /> </div>
            </div>
        </div>
    )
}