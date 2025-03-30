import { useReadContract, type SmartContract } from "thirdweb/react";

interface HasProductOwnershipProps {
  contract: SmartContract;
  _productId: number;
  _user: string;
}

export default function Component({
  contract,
  _productId,
  _user,
}: HasProductOwnershipProps) {
  const { data, isPending, error } = useReadContract<boolean>({
    contract,
    method:
      "function hasProductOwnership(uint256 _productId, address _user) view returns (bool)",
    params: [_productId, _user],
  });

  return (
    <div>
      {isPending && <p>Checking ownership...</p>}
      {error && <p>Error checking ownership: {error.message}</p>}
      {data !== undefined && (
        <p>
          User {_user} {data ? "owns" : "does not own"} product #{_productId}
        </p>
      )}
    </div>
  );
}
