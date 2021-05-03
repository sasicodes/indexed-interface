import { BrowserRouter, Route } from "react-router-dom";
import {
  DEBUG,
  DrawerProvider,
  ErrorBoundary,
  LayoutHeader,
  Logo,
  Navigation,
  Page,
  SocialMediaList,
  TransactionList,
} from "components";
import { FEATURE_FLAGS } from "feature-flags";
import { Layout, message, notification } from "antd";
import { Provider } from "react-redux";
import { Suspense, useEffect } from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import { routes } from "routes";
import { store } from "features";
import { useBreakpoints, useWalletConnection } from "hooks";

export function getLibrary(_provider?: any, _connector?: any) {
  return new ethers.providers.Web3Provider(_provider);
}

export function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <ErrorBoundary>
          <Web3ReactProvider getLibrary={getLibrary}>
            <DrawerProvider>
              <AppLayout />
            </DrawerProvider>
          </Web3ReactProvider>
        </ErrorBoundary>
      </Provider>
    </BrowserRouter>
  );
}

export function AppLayout() {
  const { isMobile } = useBreakpoints();
  const inner = (
    <>
      <LayoutHeader />
      <SocialMediaList />
      <Layout.Content
        className="with-background"
        style={{ minHeight: "100vh", paddingTop: 1 }}
      >
        <Suspense
          fallback={
            <Page hasPageHeader={false}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Logo withTitle={false} spinning={true} />
              </div>
            </Page>
          }
        >
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.component}
            />
          ))}
        </Suspense>
      </Layout.Content>
      <TransactionList />
      {isMobile && (
        <Layout.Footer
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100vw",
            background: "rgba(0, 0, 0, 0.65)",
            borderTop: "1px solid rgba(252, 47, 206, 0.4)",
            padding: 12,
            zIndex: 10,
          }}
        >
          <Navigation />
        </Layout.Footer>
      )}
      {FEATURE_FLAGS.useDEBUG && <DEBUG />}
    </>
  );

  useWalletConnection();

  // Effect:
  // Configure antd notifications and messages.
  useEffect(() => {
    message.config({
      top: isMobile ? 136 : 96,
      duration: 4.2,
    });

    notification.config({
      placement: "topRight",
      top: isMobile ? 136 : 96,
      duration: 4.2,
    });
  }, [isMobile]);

  return inner;
}
