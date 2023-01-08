import TTCSconfig from "../submodule/common/config";

export const PAGE_SIZE = 15;
export const PAGE_SIZE_COURSE = 30;
export const STATUSES = [
    {
      value: TTCSconfig.STATUS_PUBLIC,
      label: "công khai",
    },
    {
      value: TTCSconfig.STATUS_PRIVATE,
      label: "riêng tư",
    },
    {
      value: TTCSconfig.STATUS_DELETED,
      label: "đã xóa",
    },
  ];