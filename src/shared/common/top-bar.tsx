// @ts-ignore
import AntIcon from "antd/lib/icon";
import Row from "antd/lib/row";
import { Languages } from "iotex-react-language-dropdown";
import { LanguageSwitcher } from "iotex-react-language-dropdown/lib/language-switcher";
import isBrowser from "is-browser";
import { t } from "onefx/lib/iso-i18n";
import { styled, StyleObject } from "onefx/lib/styletron-react";
import React, { Component } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";
import { assetURL } from "./asset-url";
import { CommonMargin } from "./common-margin";
import { Logo as Icon } from "./icon";
import { Cross } from "./icons/cross.svg";
import { Hamburger } from "./icons/hamburger.svg";
import { transition } from "./styles/style-animation";
import { colors } from "./styles/style-color";
import { media, PALM_WIDTH } from "./styles/style-media";
import { contentPadding } from "./styles/style-padding";
import { TopbarExtMenu } from "./topbar-ext-menu";

const globalState = isBrowser && JsonGlobal("state");
const LanguageSwitcherMenu = () => {
  return (
    <Row className="language-switcher">
      <LanguageSwitcher
        supportedLanguages={[
          Languages.EN,
          Languages.ZH_CN,
          Languages.IT,
          Languages.DE
        ]}
      />
    </Row>
  );
};

const multiChain: {
  current: string;
  chains: [
    {
      name: string;
      url: string;
    }
  ];
} = {
  current: (isBrowser && globalState.base.multiChain.current) || "MAINNET",
  chains: (isBrowser && globalState.base.chainArray) || [
    {
      name: "MAINNET",
      url: "https://iotexscan.io/"
    },
    {
      name: "TESTNET",
      url: "https://testnet.iotexscan.io/"
    }
  ]
};
const CHAIN_MENU_ITEM = {
  label: multiChain.current,
  items: multiChain.chains.map(({ name, url }) => ({
    name: t(name),
    path: url
  }))
};

export const TOP_BAR_HEIGHT = 60;

type State = {
  displayMobileMenu: boolean;
};

type Props = { loggedIn: boolean; locale: string; grafanaLink: string };

export const TopBar = connect(
  (state: {
    base: { userId?: string; locale: string; grafanaLink: string };
  }) => ({
    loggedIn: Boolean(state.base.userId),
    locale: state.base.locale,
    grafanaLink: state.base.grafanaLink
  })
)(
  class TopBarInner extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        displayMobileMenu: false
      };
    }

    public componentDidMount(): void {
      window.addEventListener("resize", () => {
        if (
          document.documentElement &&
          document.documentElement.clientWidth > PALM_WIDTH
        ) {
          this.setState({
            displayMobileMenu: false
          });
        }
      });
    }

    public displayMobileMenu = () => {
      this.setState({
        displayMobileMenu: true
      });
    };

    public hideMobileMenu = () => {
      this.setState({
        displayMobileMenu: false
      });
    };

    public renderTools = (hasShadow: boolean) => {
      return (
        <TopbarExtMenu
          hasShadow={hasShadow}
          name={t("topbar.tools")}
          routes={[
            {
              name: t("topbar.explorer_playground"),
              path: "/api-gateway/"
            },
            {
              name: t("topbar.analytics_playground"),
              path: "https://analytics.iotexscan.io/"
            }
          ]}
          onClick={this.hideMobileMenu}
        />
      );
    };

    public renderBlockchain = (hasShadow: boolean) => {
      return (
        <TopbarExtMenu
          hasShadow={hasShadow}
          name={t("topbar.dashboard")}
          routes={[
            { name: t("topbar.dashboard"), path: "/" },
            { name: t("topbar.actions"), path: "/action" },
            { name: t("topbar.blocks"), path: "/block" },
            { name: t("topbar.accounts"), path: "/account" }
          ]}
          onClick={this.hideMobileMenu}
        />
      );
    };

    public renderToken = (hasShadow: boolean) => {
      return (
        <TopbarExtMenu
          hasShadow={hasShadow}
          name={t("topbar.tokensMenu")}
          routes={[
            { name: t("topbar.tokens"), path: "/tokens" },
            { name: t("topbar.xrc20Transfer"), path: "/tokentxns" }
          ]}
          onClick={this.hideMobileMenu}
        />
      );
    };

    public renderNetSelector = (hasShadow: boolean) => {
      return (
        <TopbarExtMenu
          hasShadow={hasShadow}
          name={t(CHAIN_MENU_ITEM.label)}
          routes={CHAIN_MENU_ITEM.items}
          onClick={this.hideMobileMenu}
        />
      );
    };

    public renderMobileMenu = () => {
      if (!this.state.displayMobileMenu) {
        return null;
      }

      if (!this.props.loggedIn) {
        return (
          <OutsideClickHandler onOutsideClick={this.hideMobileMenu}>
            <Dropdown>
              <A href="/login" onClick={this.hideMobileMenu}>
                {t("topbar.login")}
              </A>
              <A href="/sign-up" onClick={this.hideMobileMenu}>
                {t("topbar.sign_up")}
              </A>
            </Dropdown>
          </OutsideClickHandler>
        );
      }

      return (
        <OutsideClickHandler onOutsideClick={this.hideMobileMenu}>
          <Dropdown>
            {this.renderBlockchain(true)}
            {this.renderToken(true)}
            {this.renderTools(true)}
            <StyledLink
              to="https://member.iotex.io"
              onClick={this.hideMobileMenu}
            >
              {t("topbar.voting")}
            </StyledLink>
            <StyledLink to="/wallet/transfer" onClick={this.hideMobileMenu}>
              {t("topbar.wallet")}
            </StyledLink>
            {this.renderNetSelector(true)}
          </Dropdown>
        </OutsideClickHandler>
      );
    };

    public render(): JSX.Element {
      const { locale } = this.props;
      const displayMobileMenu = this.state.displayMobileMenu;

      return (
        <div>
          <Bar>
            <Flex>
              <LinkLogoWrapper to={`/`}>
                <Icon
                  height="38px"
                  width="auto"
                  margin="11px 0"
                  url={assetURL(
                    locale === "en"
                      ? "/logo_explorer.png"
                      : "/logo_explorer.png"
                  )}
                />
              </LinkLogoWrapper>
              <CommonMargin />
              <CommonMargin />
              <CommonMargin />
              <HiddenOnMobile>
                {this.renderBlockchain(true)}
                {this.renderToken(true)}
                {this.renderTools(true)}
                <BrandLinkExternalUrl
                  href="https://member.iotex.io"
                  target="_blank"
                  onClick={this.hideMobileMenu}
                >
                  {t("topbar.voting")}
                </BrandLinkExternalUrl>
                <BrandLink to="/wallet/transfer" onClick={this.hideMobileMenu}>
                  {t("topbar.wallet")}
                </BrandLink>
                <CommonMargin />
                <CommonMargin />
                <CommonMargin />
              </HiddenOnMobile>
              {this.renderNetSelector(true)}
              <CommonMargin />
              <LanguageSwitcherMenu />
            </Flex>
            <HamburgerBtn
              onClick={this.displayMobileMenu}
              displayMobileMenu={displayMobileMenu}
            >
              <Hamburger />
            </HamburgerBtn>
            <CrossBtn displayMobileMenu={displayMobileMenu}>
              <Cross />
            </CrossBtn>
          </Bar>
          {this.renderMobileMenu()}
        </div>
      );
    }
  }
);

const Bar = styled("div", {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  lineHeight: `${TOP_BAR_HEIGHT}px`,
  height: `${TOP_BAR_HEIGHT}px`,
  backgroundColor: colors.nav01,
  top: "0px",
  left: "0px",
  width: "100%",
  "z-index": "70",
  ...contentPadding,
  boxSizing: "border-box",
  boxShadow: "0"
});

function HamburgerBtn({
  displayMobileMenu,
  children,
  onClick
}: {
  displayMobileMenu: boolean;
  children: Array<JSX.Element> | JSX.Element;
  onClick: Function;
}): JSX.Element {
  const Styled = styled("div", {
    ":hover": {
      color: colors.primary
    },
    display: "none!important",
    [media.toLap]: {
      display: "flex!important",
      ...(displayMobileMenu ? { display: "none!important" } : {})
    },
    cursor: "pointer",
    justifyContent: "center"
  });
  return (
    <Styled
      // @ts-ignore
      onClick={onClick}
    >
      {children}
    </Styled>
  );
}

function CrossBtn({
  displayMobileMenu,
  children
}: {
  displayMobileMenu: boolean;
  children: Array<JSX.Element> | JSX.Element;
}): JSX.Element {
  const Styled = styled("div", {
    ":hover": {
      color: colors.primary
    },
    display: "none!important",
    [media.toLap]: {
      display: "none!important",
      ...(displayMobileMenu ? { display: "flex!important" } : {})
    },
    cursor: "pointer",
    justifyContent: "center",
    padding: "5px"
  });
  return <Styled>{children}</Styled>;
}

const LinkLogoWrapper = styled(Link, {
  width: `${TOP_BAR_HEIGHT * 3}px`,
  height: `${TOP_BAR_HEIGHT}px`
});
const menuItem: StyleObject = {
  color: colors.topbarColor,
  marginLeft: "14px",
  textDecoration: "none",
  ":hover": {
    color: colors.primary
  },
  transition,
  padding: "0 20px",
  [media.toLap]: {
    boxSizing: "border-box",
    width: "100%",
    padding: "16px 0 16px 0",
    borderBottom: "1px #EDEDED solid"
  }
};
const A = styled("a", menuItem);
const BrandLink = styled(Link, {
  ...menuItem,
  [media.toLap]: {}
});
const BrandLinkExternalUrl = styled("a", {
  ...menuItem,
  [media.toLap]: {}
});
// @ts-ignore
const StyledLink = styled(Link, menuItem);

const Flex = styled("div", (_: React.CSSProperties) => ({
  flexDirection: "row",
  display: "flex",
  boxSizing: "border-box"
}));

const Dropdown = styled("div", {
  backgroundColor: colors.nav01,
  display: "flex",
  flexDirection: "column",
  ...contentPadding,
  position: "fixed",
  top: TOP_BAR_HEIGHT,
  "z-index": "4",
  width: "100vw",
  height: "100vh",
  alignItems: "flex-end!important",
  boxSizing: "border-box"
});

const HiddenOnMobile = styled("div", {
  display: "flex!important",
  [media.toLap]: {
    display: "none!important"
  }
});
