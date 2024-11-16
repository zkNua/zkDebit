import { TransactionStatus } from '@bitkub-chain/sdk.js'
import { useEffect, useState } from 'react'

import { useAuth } from '@contexts/auth'

import AuthenticationsSection from '@components/authentications-section'

import { sdk } from '@lib/bitkubchain-sdk'
import {
  BlockWrapper,
  InputTitle,
  ItemWrapper,
  LoadingWrapper,
  Spinner,
  StatusText,
  Title,
  TransactionStatusWrapper,
  TransactionWrapper,
} from '@styles/custom-styled-components'

const DEFAULT_FUNCTION_READABLE_ABI =
  'function transfer(address _tokenAddr, address _recipient, uint256 _amount, address _bitkubNext)'

const KKUB_ADDRESS = '0x1BbE34CF9fd2E0669deEE34c68282ec1e6c44ab0'

const CustomTx = () => {
  const { isLoggedIn } = useAuth()

  const [contractAddress, setContractAddress] = useState<string>('0x9688F8174eCb3f8c0f17832b9D66a118435a3e60') // Example contract address to transfer kap20
  const [functionReadableABI, setFunctionReadableABI] = useState<string>(DEFAULT_FUNCTION_READABLE_ABI)
  const [methodParams, setMethodParams] = useState(`["${KKUB_ADDRESS}", "to-address", "1000000000000000000"]`)

  const [queueId, setQueueId] = useState<string>('')
  const [status, setStatus] = useState<TransactionStatus | null>(null)
  const [txHash, setTxHash] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (queueId) {
      // interval get transaction detail every 3 seconds until FAILED or MINED
      const interval = setInterval(async () => {
        const result = await handleGetTransactionDetail(queueId)
        setStatus(result.status)
        if (result.status === TransactionStatus.MINED) {
          setTxHash(result.txHash)
          setQueueId('')
          setLoading(false)
          clearInterval(interval)
        } else if (result.status === TransactionStatus.FAILED) {
          setQueueId('')
          setLoading(false)
          clearInterval(interval)
        }
      }, 3000)
    }
  }, [queueId])

  const handleGetTransactionDetail = async (queue: string) => {
    return await sdk.getTransactionDetails(queue)
  }

  const handleSendCustomTransaction = async () => {
    setLoading(true)
    const result = await sdk.sendCustomTx(contractAddress, functionReadableABI, JSON.parse(methodParams))
    setQueueId(result.queueID)
  }

  return (
    <>
      <h1>⚙️ Custom Transaction</h1>
      <AuthenticationsSection />
      <div className='divider' />

      {isLoggedIn && (
        <>
          <h2>Send Custom Transaction</h2>
          <Title>sdk.sendCustomTx()</Title>
          <div className='flex flex-direction-col'>
            <ItemWrapper className='ibm-plex-mono flex flex-direction-col' showData={status !== null}>
              <InputTitle>Contract Address</InputTitle>
              <input onChange={(e) => setContractAddress(e.target.value)} placeholder='Token Address' value={contractAddress} />

              <InputTitle>Function Readable ABI</InputTitle>
              <input
                onChange={(e) => setFunctionReadableABI(e.target.value)}
                placeholder={DEFAULT_FUNCTION_READABLE_ABI}
                value={functionReadableABI}
              />

              <InputTitle>Method Params</InputTitle>
              <input onChange={(e) => setMethodParams(e.target.value)} placeholder='[1, 2]' value={methodParams} />

              <button
                className='primary-button'
                disabled={!functionReadableABI || !methodParams || loading}
                onClick={handleSendCustomTransaction}
              >
                {loading ? (
                  <LoadingWrapper>
                    <Spinner /> Loading
                  </LoadingWrapper>
                ) : (
                  <>Execute</>
                )}
              </button>
            </ItemWrapper>
            {status && (
              <BlockWrapper>
                <TransactionWrapper>
                  <TransactionStatusWrapper>Transaction status:</TransactionStatusWrapper>
                  <StatusText status={status}>{status}</StatusText>
                </TransactionWrapper>

                {txHash && status === TransactionStatus.MINED && (
                  <TransactionWrapper>
                    <TransactionStatusWrapper>Transaction Hash:</TransactionStatusWrapper>
                    <a href={`https://testnet.bkcscan.com/tx/${txHash}`} target='_blank'>
                      {txHash}
                    </a>
                  </TransactionWrapper>
                )}
              </BlockWrapper>
            )}
          </div>
          <div className='divider' />
        </>
      )}
    </>
  )
}

export default CustomTx
