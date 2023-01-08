import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Form, Image, Input, Modal, notification, Popconfirm, Row, Select, Space, Table, Tag, Tooltip, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import styles from "./courses.module.scss";
import classNames from "classnames/bind"
import { useForm } from "antd/es/form/Form";
import { courseState, requestLoadByIdTagAndCategory, requestLoadCourses, requestUpdateCourse } from "./courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import TTCSconfig from "../../submodule/common/config";
import { convertSlug } from "../../utils/slug";
import TinymceEditor from "../../components/TinymceEditor";
import UploadImg from "../../components/UploadImg";
import { Course } from "../../submodule/models/course";
import { categoryState, requestLoadCategorys } from "../categorys/categorySlice";
import { requestLoadTags, tagState } from "../tags/tagSlice";
import { PAGE_SIZE, PAGE_SIZE_COURSE, STATUSES } from "../../utils/contraint";
import { useNavigate } from "react-router-dom";
  
const cx = classNames.bind(styles);
interface DataType {
  key: string;
  courseName: string;
  slug: string;
  status: number;
  create: number;
  value: Course;
  idCategory: string | undefined;
  idTag: string | undefined;
  avatar: string | null;
}

const normFile = (e: any) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const CoursePage = () => {
  const [form] = useForm();
  const descRef = useRef<any>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const courseStates = useAppSelector(courseState)
  const courses = courseStates.courses;
  const loading = courseStates.loading;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datas, setDatas] = useState<DataType[]>([]);
  const [dataUpload, setDataupload] = useState<string | null>()
  const [valueEdit, setValueEdit] = useState<Course | undefined>();
  const [statusCourse, setStatusCourse] = useState<number>(TTCSconfig.STATUS_PUBLIC);
  const [idCategorys, setIdCategorys] = useState<any>(-1);
  const [idTags, setIdTags] = useState<any>(-1);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const categoryStates = useAppSelector(categoryState);
  const categorys = categoryStates.categorys;
  const tagStates = useAppSelector(tagState);
  const tags = tagStates.tags;
  
  useEffect(() => {
    setDatas(courses?.map(o => convertDataToTable(o)))
  }, [courses])

  useEffect(() => {
    if (valueEdit) {
      const { courseName, slug, status, des, idCategory, idTag } = valueEdit
      form.setFieldsValue({ courseName, slug, status, idCategory, idTag })
      descRef?.current?.setContent(des)
    }
  }, [valueEdit])
  
  useEffect(() => {
    loadCategorys();
    loadTags();
  }, []);

  useEffect(() => {
    if((idTags || idCategorys) && !(idTags === -1 && idCategorys === -1)) {
      if(idTags === -1) {
        loadByIdTagAndCategory(idCategorys, undefined, statusCourse );
      }else if(idCategorys === -1) {
        loadByIdTagAndCategory(undefined, idTags, statusCourse );
      }else 
        loadByIdTagAndCategory(idCategorys, idTags, statusCourse );
    }else {
      loadCourses(statusCourse)
    }
  }, [statusCourse, idCategorys, idTags]);

  const loadByIdTagAndCategory = async (idCategory: any, idTag: any, status: number) => {
    try {
      const actionResult = await dispatch(requestLoadByIdTagAndCategory({
        idCategory,
        idTag,
        status
      }))
      unwrapResult(actionResult)
    } catch (error) {
      notification.error({
        message: 'không tải được danh sach danh mục'
      })
    }
  }

  const loadCourses = async (status: number) => {
    try {
      const actionResult = await dispatch(requestLoadCourses({
        status
      }))
      unwrapResult(actionResult)
    } catch (error) {
      notification.error({
        message: 'không tải được danh sach danh mục'
      })
    }
  }

  const loadCategorys = async () => {
    try {
      const actionResult = await dispatch(
        requestLoadCategorys({
          status: 1,
        })
      );
      const res = unwrapResult(actionResult);
    } catch (error) {
      notification.error({
        message: "không tải được danh sach danh mục",
      });
    }
  };

  const loadTags = async () => {
    try {
      const actionResult = await dispatch(
        requestLoadTags({
          status: 1,
        })
      );
      const res = unwrapResult(actionResult);
    } catch (error) {
      notification.error({
        message: "không tải được danh sach danh mục",
      });
    }
  };

  const convertDataToTable = (value: Course) => {
    return {
      key: `${value?.id || Math.random()}`,
      courseName: value?.courseName,
      slug: value?.slug,
      status: value?.status,
      create: value?.createDate || 0,
      idCategory: value?.idCategory,
      idTag: value?.idTag,
      avatar: value?.avatar,
      value: value
    }
  }

  const openCreateModal = () => {
    setIsModalOpen(true);
    setValueEdit(undefined);
    setIsEdit(false);
  };


  const handleOk = () => {
    form.validateFields()
      .then(async (value) => {
        try {
          const data = await dispatch(requestUpdateCourse({
            id: valueEdit?.id,
            ...value,
            des: descRef?.current?.getContent(),
            avatar: dataUpload
          }))
          unwrapResult(data)

          notification.success({
            message: "Cập nhật thành công",
            duration: 1.5,
          })
          if((idTags || idCategorys) && !(idTags === -1 && idCategorys === -1)) {
            if(idTags === -1) {
              loadByIdTagAndCategory(idCategorys, undefined, statusCourse );
            }else if(idCategorys === -1) {
              loadByIdTagAndCategory(undefined, idTags, statusCourse );
            }else 
              loadByIdTagAndCategory(idCategorys, idTags, statusCourse );
          }else {
            loadCourses(statusCourse)
          }

        } catch (error) {
          notification.error({
            message: 'cập nhật không được',
            duration: 1.5
          })
        }
        handleCancel();
      })
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    descRef?.current?.setContent('')
    setValueEdit(undefined)
  };

  const handleDelete = async (value: Course) => {
    try {
      const data = await dispatch(requestUpdateCourse({
        ...value,
        status: TTCSconfig.STATUS_DELETED
      }))
      unwrapResult(data)
      dispatch(requestLoadCourses({
        status: statusCourse
      }))
      notification.success({
        message: "Xoá thành công",
        duration: 1.5,
      })
    } catch (error) {
      notification.error({
        message: 'cập nhật không được',
        duration: 1.5
      })
    }
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "STT",
      key: "stt",
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên khóa học",
      dataIndex: "courseName",
      key: "courseName",
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
      title: "Danh mục cha",
      dataIndex: "idCategory",
      key: "idCategory",
      render: (idCategory: string) => (
        <>
            {categorys.map((o) =>(o.id === idCategory ? o.name : undefined))}
        </>
      ),
    },
    {
      title: "Tag",
      dataIndex: "idTag",
      key: "idTag",
      render: (idTag: string) => (
        <>
            {tags.map((o) =>(o.id === idTag ? o.name : undefined))}
        </>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      align: "center",
      render: (text: number) => (
        <>
          <Tag color={text === TTCSconfig.STATUS_PUBLIC ? 'green' : 'red'}>
            {STATUSES.find(o => o.value === text)?.label}
          </Tag>
        </>
      ),
    },  
    {
      title: "Hành động",
      key: "action",
      dataIndex: "value",
      align: "center",
      render: (text: Course, record) => (
        <Space size="middle">
          <Tooltip placement="top" title="Chỉnh sửa">
            <Button onClick={() => {
              setIsModalOpen(true)
              setValueEdit(text)
              setIsEdit(true);
            }}>
              <EditOutlined />
            </Button>
          </Tooltip>

          {statusCourse !== TTCSconfig.STATUS_DELETED ? 
            <Popconfirm
              placement="topRight"
              title="Bạn có chắc bạn muốn xóa mục này không?"
              onConfirm={() => {
                handleDelete(text)
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
      <Space size='large'>
        <Button
          type="primary"
          onClick={openCreateModal}
        >
          Thêm mới
        </Button>
        <Space size='small'>
          <label style={{ marginLeft: "20px" }}>Chọn trạng thái: </label>
          <Select
            placeholder={'Bộ lọc'}
            style={{ width: 150, marginLeft: "10px" }}
            defaultValue={TTCSconfig.STATUS_PUBLIC}
            options={STATUSES}
            onChange={(value) => {
              setStatusCourse(value)
            }}
          />
        </Space>

        <Space size='small'>
          <label style={{ marginLeft: "20px" }}>Chọn danh mục: </label>
          <Select
              placeholder={'Bộ lọc'}
              style={{ width: 150, marginLeft: "10px" }}
              defaultValue={-1}  
              options={[
                {
                  value: -1,
                  label: "Tất cả"
                },
                  ...categorys.map((data) => ({
                    value: data.id,
                    label: data.name,
                  }))
              ]}
              onChange={(value) => {
                setIdCategorys(value)
              }}
              listHeight={128}
            />
        </Space>

        <Space size='small'>
          <label style={{ marginLeft: "20px" }}>Chọn tag: </label>
          <Select
              placeholder={'Bộ lọc'}
              style={{ width: 150, marginLeft: "10px" }}
              defaultValue={-1}  
              options={[
                {
                  value: -1,
                  label: "Tất cả"
                },
                ...tags.map((data) => ({
                  value: data.id,
                  label: data.name,
                }))
              ]}
              onChange={(value) => {
                setIdTags(value)
              }}
              listHeight={128}
            />
        </Space>
      </Space>

      <Typography.Title level={3}>Danh sách khóa học: </Typography.Title>

      <Table 
        className={cx("course__table")}
        columns={columns}
        dataSource={datas}
        loading={loading} 
        pagination={{
          pageSize: (idCategorys !== -1 && idTags === -1 && statusCourse === 1) ? PAGE_SIZE_COURSE : PAGE_SIZE
        }}
        onRow={(record, rowIndex) => {
          return {
            onDoubleClick: (event) => {
              navigate(`chi-tiet-khoa-hoc/${record.value.id}`)
            },
          };
        }}
        
      />

      <Modal
        title={`${isEdit ? "Chỉnh sửa" : "Tạo"}  khóa học`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={`${isEdit ? "Cập nhật" : "Tạo"}`}
        cancelText="Hủy"
        width='90%'
        style={{top:20}}
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
            <Col xl={16} md={16} xs={24} style={{ borderRight: "0.1px solid #ccc" }}>
              <Form.Item label="Mô tả">
                <TinymceEditor
                  id="descriptionCourse"
                  key="descriptionCourse"
                  editorRef={descRef}
                  value={valueEdit?.des ?? ''}
                  heightEditor="500px"
                />
              </Form.Item>
            </Col>
            <Col xl={8} md={8} xs={24}>
              <Form.Item label={<h3>{'Ảnh khóa học'}</h3>} name="avatar">
                <UploadImg
                  defaultUrl={valueEdit?.avatar}
                  onChangeUrl={(value) => setDataupload(value)}
                />
              </Form.Item>

              <Form.Item
                name='courseName'
                label="Tên khóa học"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập trường này!",
                  },
                ]}
              >
                <Input onChange={(e) => {
                  form.setFieldsValue({ slug: convertSlug(e.target.value) })
                }} />
              </Form.Item>

              <Form.Item name='slug' label="Đường dẫn" rules={[
                {
                  required: true,
                  message: "Vui lòng nhập trường này!",
                },
              ]}
              >
                <Input />
              </Form.Item>

              <Form.Item 
                name='idCategory' 
                label="Danh mục cha" 
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập trường này!",
                  },
                ]}
              >
                <Select options={categorys.map((data) => ({
                  value: data.id,
                  label: data.name,
                }))} />
              </Form.Item>

              <Form.Item 
                name='idTag' 
                label="Tag" 
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập trường này!",
                  },
                ]}
              >
                <Select options={tags.map((data) => ({
                  value: data.id,
                  label: data.name,
                }))} />
              </Form.Item>

              <Form.Item name='status' label="Trạng thái">
                <Select options={STATUSES} />
              </Form.Item>
            </Col>
            
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CoursePage;
