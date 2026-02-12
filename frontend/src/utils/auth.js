export const getUserRole = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user?.role?.toLowerCase() || null;
  } catch {
    return null;
  }
};

// Accounts clerk
export const canCreateVoucher = () => {
  const role = getUserRole();
  return role === "accounts" || role === "admin";
};

// Treasurer / Hon. Secretary
export const canApproveVoucher = () => {
  const role = getUserRole();
  return (
    role === "treasurer" ||
    role === "honorary_secretary" ||
    role === "admin"
  );
};

// Accounts clerk pays
export const canPayVoucher = () => {
  const role = getUserRole();
  return role === "accounts" || role === "admin";
};
