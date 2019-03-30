import Icon from "antd/lib/icon";
import Layout from "antd/lib/layout";
import { get } from "dottie";
import React, { Component } from "react";
import { Query } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router";
import { ChainMeta } from "../../api-gateway/resolvers/antenna-types";
import { CoinPrice } from "../../api-gateway/resolvers/meta";
import { Flex } from "../common/flex";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_CHAIN_META, GET_COIN_MARKET_CAP } from "../queries";
import { BpTable } from "./bp-table";

type State = {
  marketCap: number;
  price: number;
  name: string;
};

type PathParamsType = {
  hash: string;
};

type Props = RouteComponentProps<PathParamsType> & {};

class HomeComponent extends Component<Props, State> {
  public state: State = {
    marketCap: 0,
    price: 0,
    name: "IOSG"
  };

  private readonly getTiles = (data: {
    chainMeta: ChainMeta;
    fetchCoinPrice: CoinPrice;
  }): Array<TileProps> => {
    const { history } = this.props;
    const { height, tps } = get(data, "chainMeta", {}) as ChainMeta;
    const { producerAddress } = get(data, "chainMeta.latestBlockMeta");
    const { priceUsd, marketCapUsd } = get(
      data,
      "fetchCoinPrice",
      {}
    ) as CoinPrice;

    return [
      {
        title: "PRODUCER",
        value: producerAddress.substring(0, 8),
        icon: "fire",
        action: () => {
          if (!producerAddress) {
            return;
          }
          history.push(`/address/${producerAddress}`);
        }
      },
      {
        title: "BLOCK HEIGHT",
        value: parseInt(height, 10).toLocaleString(),
        icon: "build",
        action: () => {
          if (!height) {
            return;
          }
          history.push(`/address/${producerAddress}`);
        }
      },
      {
        title: "TOTAL ACTIONS",
        value: (parseInt(tps, 10) * 10).toLocaleString(),
        icon: "dashboard",
        action: () => {
          history.push(`/actions`);
        }
      },
      {
        title: "IOTX PRICE",
        value: `${priceUsd || 0} USD`,
        icon: "dollar",
        action: () => {
          window.location.href = `https://coinmarketcap.com/currencies/iotex/?utm_source=iotexscan.i`;
        }
      },
      {
        title: "MARKETCAP",
        value: `${marketCapUsd || 0} M`,
        icon: "bank",
        action: () => {
          window.location.href = `https://coinmarketcap.com/currencies/iotex/?utm_source=iotexscan.i`;
        }
      }
    ];
  };

  public render(): JSX.Element {
    return (
      <ContentPadding>
        <div className={"section-top"}>
          <Query query={GET_CHAIN_META}>
            {({ loading, error, data }) => {
              if (loading) {
                return "Loading...";
              }
              if (error) {
                return `Error! ${error.message}`;
              }

              const chainMetaData = data;

              return (
                <Query query={GET_COIN_MARKET_CAP}>
                  {({ loading, error, data }) => {
                    if (loading) {
                      return "Loading...";
                    }
                    if (error) {
                      return `Error! ${error.message}`;
                    }

                    const tiles = this.getTiles({ ...chainMetaData, ...data });

                    return (
                      <div
                        className={"front-top-info"}
                        style={{
                          padding: 30,
                          margin: "30px 0",
                          border: "1px solid rgb(230,230,230)",
                          borderRadius: 5
                        }}
                      >
                        <Flex>
                          {tiles.map((tile, i) => (
                            <div key={i} className={"item"}>
                              <Tile
                                action={tile.action}
                                title={tile.title}
                                value={tile.value}
                                icon={tile.icon}
                              />
                            </div>
                          ))}
                        </Flex>
                      </div>
                    );
                  }}
                </Query>
              );
            }}
          </Query>
        </div>
        <Layout tagName={"main"} className={"main-container"}>
          <Layout.Content tagName={"main"}>
            <div style={{ backgroundColor: "#fff" }}>
              <BpTable />
            </div>
          </Layout.Content>
        </Layout>
      </ContentPadding>
    );
  }
}

export const Home = withRouter(HomeComponent);

type TileProps = {
  title: string;
  value: string | number;
  icon: string;
  action: Function;
};

function Tile({ title, value, icon, action }: TileProps): JSX.Element {
  return (
    <Flex center>
      <div
        style={{ width: "100%", cursor: "pointer", textAlign: "center" }}
        role="button"
        // @ts-ignore
        onClick={action}
      >
        <div>
          <Icon type={icon} />
        </div>
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>{value}</div>
        <div>{title}</div>
      </div>
    </Flex>
  );
}
