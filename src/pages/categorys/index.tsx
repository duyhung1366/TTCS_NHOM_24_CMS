import {
  BarsOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Form,
  Image,
  Input,
  Modal,
  notification,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import styles from "./categorys.module.scss";
import classNames from "classnames/bind";
import { useForm } from "antd/es/form/Form";
import {
  categoryState,
  requestLoadCategorys,
  requestOrderCategory,
  requestUpdateCategorys,
} from "./categorySlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Category } from "../../submodule/models/category";
import TTCSconfig from "../../submodule/common/config";
import { convertSlug } from "../../utils/slug";
import TinymceEditor from "../../components/TinymceEditor";
import UploadImg from "../../components/UploadImg";
import { PAGE_SIZE, STATUSES } from "../../utils/contraint";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";
import _ from "lodash" ;

const cx = classNames.bind(styles);
interface DataType {
  key: string;
  name: string;
  slug: string;
  status: number;
  create: number;
  value: Category;
  avatar: string | null;
}

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};


const CategoryPage = () => {
  const [form] = useForm();
  const descRef = useRef<any>();
  const dispatch = useAppDispatch();
  const categoryStates = useAppSelector(categoryState);
  const categorys = categoryStates.categorys;
  const loading = categoryStates.loading;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datas, setDatas] = useState<DataType[]>([]);
  const [dataUpload, setDataupload] = useState<string | null>();
  const [valueEdit, setValueEdit] = useState<Category | undefined>();
  const [statusCategory, setStatusCategory] = useState<number>(
    TTCSconfig.STATUS_PUBLIC
  );
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [categoryList, setCategoryList] = useState<Category[]>([])

  useEffect(() => {
    setDatas(categorys?.map((o) => convertDataToTable(o)));
      const sortCategorys = _.sortBy(categorys, [(o) => {
        return o.index
      }], ['esc'])
      
      setCategoryList(sortCategorys);
  }, [categorys]);

  useEffect(() => {
    if (valueEdit) {
      const { name, slug, status, des, index } = valueEdit;
      form.setFieldsValue({ name, slug, status });
      descRef?.current?.setContent(des);
    }
  }, [valueEdit]);

  useEffect(() => {
    loadCategorys(statusCategory);
  }, [statusCategory]);

  const loadCategorys = async (status: number) => {
    try {
      const actionResult = await dispatch(
        requestLoadCategorys({
          status,
        })
      );
      unwrapResult(actionResult);
    } catch (error) {
      notification.error({
        message: "không tải được danh sach danh mục",
      });
    }
  };

  const convertDataToTable = (value: Category) => {
    return {
      key: `${value?.id || Math.random()}`,
      name: value?.name,
      slug: value?.slug,
      status: value?.status,
      create: value?.createDate || 0,
      value: value,
      avatar: value?.avatar 
    };
  };

  const openCreateModal = () => {
    setIsModalOpen(true);
    setValueEdit(undefined);
    setIsEdit(false);
  };

  const handleOk = () => {
    form.validateFields().then(async (value) => {
      try {
        const data = await dispatch(
          requestUpdateCategorys({
            id: valueEdit?.id,
            ...value,
            des: descRef?.current?.getContent(),
            avatar: dataUpload,
          })
        );
        unwrapResult(data);
        dispatch(
          requestLoadCategorys({
            status: statusCategory,
          })
        );
        notification.success({
          message: "Cập nhật thành công",
          duration: 1.5,
        });
      } catch (error) {
        notification.error({
          message: "cập nhật không được",
          duration: 1.5,
        });
      }
      handleCancel();
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    descRef?.current?.setContent("");
    setValueEdit(undefined);
  };

  const handleDelete = async (value: Category) => {
    try {
      const data = await dispatch(
        requestUpdateCategorys({
          ...value,
          status: TTCSconfig.STATUS_DELETED,
        })
      );
      unwrapResult(data);
      dispatch(
        requestLoadCategorys({
          status: statusCategory,
        })
      );
      notification.success({
        message: "Xoá thành công",
        duration: 1.5,
      })
    } catch (error) {
      notification.error({
        message: "cập nhật không được",
        duration: 1.5,
      });
    }
  };

  const handleDropEndCategory = async (
    result: DropResult,
    provided: ResponderProvided
  ) => {
    const srcIndex = result.source.index;
    const destIndex = result.destination?.index;

    if (typeof srcIndex !== "undefined" && typeof destIndex !== "undefined") {
      const newCourses = srcIndex < destIndex
          ? [
              ...categoryList.slice(0, srcIndex),
              ...categoryList.slice(srcIndex + 1, destIndex + 1),
              categoryList[srcIndex],
              ...categoryList.slice(destIndex + 1),
            ]
          : srcIndex > destIndex
          ? [
              ...categoryList.slice(0, destIndex),
              categoryList[srcIndex],
              ...categoryList.slice(destIndex, srcIndex),
              ...categoryList.slice(srcIndex + 1),
            ]
          : categoryList;

      const dataIndex = newCourses.map((e, i) => ({
        id: e.id || "",
        index: i,
      }));

      setCategoryList(newCourses);

      const res = await dispatch(
        requestOrderCategory({
          indexRange: dataIndex,
          status: statusCategory,
        })
      );
      unwrapResult(res);

      await dispatch(
        requestLoadCategorys({
          status: statusCategory,
        })
      );
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Ảnh",
      dataIndex: "avatar",
      key: "avatar",
      render: (text) => (
        <Image
          src={text}
          width={150}
          preview={false}
          style={{
            maxHeight: "80px",
            overflow: "hidden",
          }}
        />
      ),
    },
    {
      title: "Đường dẫn",
      dataIndex: "slug",
      key: "slug",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (text: number) => (
        <>
          <Tag color={text === TTCSconfig.STATUS_PUBLIC ? "green" : "red"}>
            {STATUSES.find((o) => o.value === text)?.label}
          </Tag>
        </>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      dataIndex: "value",
      align: "center",
      render: (text: Category, record) => (
        <Space size="middle">
          <Tooltip placement="top" title="Chỉnh sửa">
            <Button
              onClick={() => {
                setIsModalOpen(true);
                setValueEdit(text);
                setIsEdit(true);
              }}
            >
              <EditOutlined />
            </Button>
          </Tooltip>
          {statusCategory !== TTCSconfig.STATUS_DELETED ? 
            <Popconfirm
              placement="topRight"
              title="Bạn có chắc bạn muốn xóa mục này không?"
              onConfirm={() => {
                handleDelete(text);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip placement="top" title="Xóa">
                <Button>
                  <DeleteOutlined />
                </Button>
              </Tooltip>
            </Popconfirm>: <></>}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space size="large">
        <Button type="primary" onClick={openCreateModal}>
          Thêm mới
        </Button>

        <Space size="small">
          <label style={{ marginLeft: "20px" }}>Chọn trạng thái:</label>
          <Select
            placeholder={"Bộ lọc"}
            style={{ width: 150, marginLeft: "10px" }}
            defaultValue={TTCSconfig.STATUS_PUBLIC}
            options={STATUSES}
            onChange={(value) => {
              setStatusCategory(value);
            }}
          />
        </Space>
      </Space>

      <Typography.Title level={3}>Danh sách danh mục: </Typography.Title>

      {statusCategory === TTCSconfig.STATUS_PUBLIC ? (
        <DragDropContext onDragEnd={handleDropEndCategory}>
          <Droppable droppableId="list-courses-wrap">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <Row className={cx("header__table")}>
                  <Col span={2}>STT</Col>
                  <Col span={6}>Ảnh</Col>
                  <Col span={4}>Tên khóa học</Col>
                  <Col span={4}>Đường dẫn</Col>
                  <Col span={4}>Trạng thái</Col>
                  <Col span={4}>Hành động</Col>
                </Row>

                {categoryList.length
                  ? categoryList.map((e, ind) => {
                        const id = e?.id;
                        const indCategory = e.index;
                        return (
                          <Draggable
                            key={e.id}
                            draggableId={e?.id || ""}
                            index={ind}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div
                                  id={id}
                                  key={ind}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <BarsOutlined
                                    style={{
                                      fontSize: "32px",
                                      marginRight: "8px",
                                    }}
                                  />
                                  <Row className={cx("category-item")}>
                                    <Col span={2}>
                                      <Avatar
                                        style={{
                                          fontWeight: "bold",
                                          background: "#1990ff",
                                          marginLeft: "8px",
                                        }}
                                        size="large"
                                      >
                                        {ind + 1}
                                      </Avatar>
                                    </Col>
                                    <Col span={6}>
                                      <Image
                                        src={e.avatar ?? ""}
                                        width={150}
                                        preview={false}
                                        style={{
                                          maxHeight: "80px",
                                          overflow: "hidden",
                                        }}
                                      />
                                    </Col>
                                    <Col span={4}>{e.name}</Col>
                                    <Col span={4}>{e.slug}</Col>
                                    <Col span={4}>
                                      <Tag
                                        color={
                                          e.status === TTCSconfig.STATUS_PUBLIC
                                            ? "green"
                                            : "red"
                                        }
                                      >
                                        {
                                          STATUSES.find(
                                            (o) => o.value === e.status
                                          )?.label
                                        }
                                      </Tag>
                                    </Col>
                                    <Col span={4}>
                                      <Row style={{ justifyContent: "center" }}>
                                        <Tooltip
                                          placement="top"
                                          title="Chỉnh sửa"
                                        >
                                          <Button
                                            style={{ marginRight: 8 }}
                                            onClick={() => {
                                              setIsModalOpen(true);
                                              setValueEdit(e);
                                              setIsEdit(true);
                                            }}
                                          >
                                            <EditOutlined />
                                          </Button>
                                        </Tooltip>

                                        <Popconfirm
                                          placement="topRight"
                                          title="Bạn có chắc bạn muốn xóa mục này không?"
                                          cancelText="KHÔNG"
                                          okText="CÓ"
                                          onConfirm={() => {
                                            handleDelete(e);
                                          }}
                                        >
                                          <Tooltip placement="top" title="Xóa">
                                            <Button>
                                              <DeleteOutlined />
                                            </Button>
                                          </Tooltip>
                                        </Popconfirm>
                                      </Row>
                                    </Col>
                                  </Row>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })
                  : ""}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <Table
          columns={columns}
          dataSource={datas}
          loading={loading}
          pagination={{
            pageSize: PAGE_SIZE,
          }}
        />
      )}

      <Modal
        title={`${isEdit ? "Chỉnh sửa" : "Tạo"} danh mục`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={`${isEdit ? "Cập nhật" : "Tạo"}`}
        cancelText="Hủy"
        width="90%"
        style={{ top: 20 }}
        maskClosable={false}
      >
        <Form
          layout="vertical"
          name="register"
          initialValues={{
            status: 1,
          }}
          form={form}
        >
          <Row gutter={{ xl: 48, md: 16, xs: 0 }}>
            <Col
              xl={16}
              md={16}
              xs={24}
              style={{ borderRight: "0.1px solid #ccc" }}
            >
              <Form.Item className="model-category__formItem" label="Mô tả">
                <TinymceEditor
                  id="descriptionCategory"
                  key="descriptionCategory"
                  editorRef={descRef}
                  value={valueEdit?.des ?? ""}
                  heightEditor="500px"
                />
              </Form.Item>
            </Col>
            <Col xl={8} md={8} xs={24}>
              <Form.Item label={<h3>{"Ảnh danh mục"}</h3>} name="avatar">
                <UploadImg
                  defaultUrl={valueEdit?.avatar}
                  onChangeUrl={(value) => setDataupload(value)}
                />
              </Form.Item>

              <Form.Item
                name="name"
                label="Tên danh mục"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập trường này!",
                  },
                ]}
              >
                <Input
                  onChange={(e) => {
                    form.setFieldsValue({ slug: convertSlug(e.target.value) });
                  }}
                />
              </Form.Item>

              <Form.Item
                name="slug"
                label="Đường dẫn"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập trường này!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="status" label="Trạng thái">
                <Select options={STATUSES} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryPage;
