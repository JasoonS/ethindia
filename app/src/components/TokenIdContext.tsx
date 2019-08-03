import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const TokenIdContext = createContext<any>('');


interface ProviderProps {
  children: any,//React.Component
  tokenId: number
}

export const TokenIdProvider: React.FunctionComponent<ProviderProps> = ({ children, tokenId }) => {
  return <TokenIdContext.Provider value={tokenId}>
    {children}
  </TokenIdContext.Provider>
};

TokenIdProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTokenId = () => useContext(TokenIdContext);

export const connectTokenId = (WrappedComponent: any) => {
  return (props: any) => {
    const tokenId = useTokenId()
    const newProps = { ...props, tokenId }
    return <WrappedComponent {...newProps} />
  }
}
