import Header from "./Header"
import { Route, Routes } from 'react-router-dom'
import routes from '../routes'

import { Suspense, lazy } from 'react'
import SuspenseContent from "./SuspenseContent"
import { useSelector } from 'react-redux'
import { useEffect, useRef } from "react"

const Page404 = lazy(() => import('../pages/protected/404'))

function PageContent(){
    const mainContentRef = useRef(null);
    const {pageTitle} = useSelector(state => state.header)

    // Scroll back to top on new page load
    useEffect(() => {
        if (mainContentRef.current) {
            mainContentRef.current.scroll({
                top: 0,
                behavior: "smooth"
            });
        }
    }, [pageTitle])

    // Flatten the routes array (in case of admin grouped routes)
    const flattenRoutes = (routes) => {
        console.log("All routes in flatten map:", routes.map(r => r.path));


        return routes.flatMap(route => route.routes ? route.routes : [route]);

    };

    const allRoutes = flattenRoutes(routes);
    console.log("All routes:", allRoutes.map(r => r.path));


    return (
        <div className="drawer-content flex flex-col">
            <Header />
            <main className="flex-1 overflow-y-auto md:pt-4 pt-4 px-6 bg-base-200" ref={mainContentRef}>
                <Suspense fallback={<SuspenseContent />}>
                    <Routes>
                        {allRoutes.map((route, key) => (
                            <Route
                                key={key}
                                path={route.path}
                                element={<route.component />}
                            />
                        ))}
                        {/* 404 fallback */}
                        <Route path="*" element={<Page404 />} />
                    </Routes>
                </Suspense>
                <div className="h-16"></div>
            </main>
        </div>
    )
}

export default PageContent
