import { Framework as SuperfluidFramework } from "@superfluid-finance/sdk-core";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import ActivityIndicator from "../components/ActivityIndicator";

export const Support = ({ address, provider }) => {
  const [superfluid, setSuperfluid] = useState(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [existingFlow, setExistingFlow] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const daiTokenContract = "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f";

  const createFlow = async () => {
    setLoading(true);
    const daix = await superfluid.loadSuperToken("fDAIx");
    const signer = provider.getSigner(0);
    const createFlowOperation = superfluid.cfaV1.createFlow({
      sender: address,
      receiver: process.env.REACT_APP_CONTRACT_ADDRESS,
      superToken: daix.address,
      flowRate: amount,
    });
    try {
      const txnResponse = await createFlowOperation.exec(signer);
      const txnReceipt = await txnResponse.wait();
      setLoading(false);
      setModalOpen(false);
      setExistingFlow(true);
    } catch (e) {
      setLoading(false);
    }
  };

  const deleteFlow = async () => {
    setLoading(true);
    const signer = provider.getSigner(0);
    try {
      const deleteFlowOperation = superfluid.cfaV1.deleteFlow({
        sender: address,
        receiver: process.env.REACT_APP_CONTRACT_ADDRESS,
        superToken: daiTokenContract,
      });
      console.log("Deleting your stream...");

      const transaction = await deleteFlowOperation.exec(signer);
      await transaction.wait();
      console.log(
        `Congrats - you've just deleted your money stream!
           Super Token: DAIxF
           Sender: ${address}
           Receiver: ${process.env.REACT_APP_CONTRACT_ADDRESS}
        `
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    if (!provider) {
      setSuperfluid(undefined);
      return;
    }
    SuperfluidFramework.create({
      chainId: 80001,
      provider,
    }).then(setSuperfluid);
  }, [provider]);

  useEffect(() => {
    if (!superfluid) return;
    setLoading(true);
    const fetchStream = async () => {
      const daix = await superfluid.loadSuperToken("fDAIx");
      const signer = provider.getSigner(0);
      try {
        const flow = await superfluid.cfaV1.getFlow({
          sender: address,
          receiver: process.env.REACT_APP_CONTRACT_ADDRESS,
          superToken: daix.address,
          providerOrSigner: signer,
        });
        if (Number(flow.flowRate) > 0) {
          console.log(flow);
          setExistingFlow(flow);
        }
      } catch (e) {
        console.log(e);
        setExistingFlow(null);
        setLoading(false);
      }
    };

    setTimeout(() => {
      fetchStream();
      setLoading(false);
    }, 3000);
  }, [address, provider, superfluid]);

  if (!superfluid)
    return <div>Please sign in using Polygon Network to open a stream</div>;

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <>
      {existingFlow ? (
        <>
          <p>You are already supporting us :)</p>
          <p>
            Current deposit: {ethers.utils.formatEther(existingFlow.deposit)}{" "}
            DAI
          </p>
          <button onClick={deleteFlow}>Stop Stream</button>
        </>
      ) : (
        <button onClick={() => setModalOpen(true)}>
          Sponsor (create stream)
        </button>
      )}
      {modalOpen && (
        <div
          className="h-full w-full top-0 left-0 absolute bg-[#000000a0] flex justify-center items-center text-black"
          onClick={() => !isLoading && setModalOpen(false)}
        >
          <div
            className="p-4 bg-white w-96 min-h-80 rounded-xl"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {isLoading ? (
              <div>Waiting for tx confirmation...</div>
            ) : (
              <>
                <div className="flex justify-between mb-4 align-center">
                  <div className="text-gray-400">Open a new stream</div>
                  <button onClick={() => setModalOpen(false)}>Close</button>
                </div>
                <div>
                  <input
                    className="block w-full py-2 px-4 rounded shadow-inner mb-4 bg-neutral-100"
                    placeholder="fDAIx Amount"
                    type="number"
                    onChange={(e) =>
                      setAmount(
                        e.target.value === "" ? "" : "" + Number(e.target.value)
                      )
                    }
                  />
                  <button
                    onClick={createFlow}
                    className="py-2 px-4 rounded shadow-lg block w-full bg-neutral-100"
                  >
                    Open stream
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
