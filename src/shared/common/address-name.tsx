import Icon from "antd/lib/icon";
import { get } from "dottie";
import { validateAddress } from "iotex-antenna/lib/account/utils";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import {connect} from "react-redux";
import { CopyToClipboard } from "../common/copy-to-clipboard";
import { GET_ADDRESS_META } from "../queries";
import {convertAddress} from "../utils/util";
import { LinkButton } from "./buttons";

const Address: React.FC<{ address: string, toEthAddress: boolean }> = ({ address, toEthAddress }) => {
  if (!validateAddress(address)) {
    return <LinkButton>{address}</LinkButton>;
  }
  return (
    <Query
      query={GET_ADDRESS_META}
      variables={{ address }}
      errorPolicy="ignore"
    >
      {({ data }: QueryResult<{ name: string }>) => {
        const { name = address } = get(data || {}, "addressMeta") || {};
        if (!name) {
          return (
            <LinkButton href={`/address/${convertAddress(toEthAddress, address)}`}>{convertAddress(toEthAddress, address)}</LinkButton>
          );
        }
        return (
          <LinkButton href={`/address/${convertAddress(toEthAddress, address)}`}>
            {name || convertAddress(toEthAddress, address)}
          </LinkButton>
        );
      }}
    </Query>
  );
};

type Props = {
  toEthAddress: boolean
};

const AddressName = connect(
  (state: {
    base: {
      toEthAddress: boolean
    };
  }): Props => {
    return {
      toEthAddress: state.base.toEthAddress
    };
  }
)(Address);


const CopyAddress = connect(
  (state: {
    base: {
      toEthAddress: boolean
    };
  }): Props => {
    return {
      toEthAddress: state.base.toEthAddress
    };
  }
)(({value, toEthAddress}: {value: string, toEthAddress: boolean}) => {
  return (
    <CopyToClipboard
    text={convertAddress(toEthAddress, value)}
    title={t("copy.copyToClipboard", { field: t("common.address") })}
  >
    <Icon type="copy" />
  </CopyToClipboard>
  )
});


export { AddressName, CopyAddress };
