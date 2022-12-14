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
import { PAGE_SIZE, PAGE_SIZE_COURSE } from "../../utils/contraint";
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

  const categoryStates = useAppSelector(categoryState);
  const categorys = categoryStates.categorys;
  const tagStates = useAppSelector(tagState);
  const tags = tagStates.tags;
  
  const status = [  
    {
      value: TTCSconfig.STATUS_PUBLIC,
      label: 'c??ng khai'
    }, {
      value: TTCSconfig.STATUS_PRIVATE,
      label: 'ri??ng t??'
    }, {
      value: TTCSconfig.STATUS_DELETED,
      label: '???? x??a'
    }
  ]

  useEffect(() => {
    loadCourses(TTCSconfig.STATUS_PUBLIC)
  }, [])

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
        message: 'kh??ng t???i ???????c danh sach danh m???c'
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
        message: 'kh??ng t???i ???????c danh sach danh m???c'
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
        message: "kh??ng t???i ???????c danh sach danh m???c",
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
        message: "kh??ng t???i ???????c danh sach danh m???c",
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

  const showModal = () => {
    setIsModalOpen(true);
    setValueEdit(undefined)
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
            message: "C???p nh???t th??nh c??ng",
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
            message: 'c???p nh???t kh??ng ???????c',
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
        message: "Xo?? th??nh c??ng",
        duration: 1.5,
      })
    } catch (error) {
      notification.error({
        message: 'c???p nh???t kh??ng ???????c',
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
      title: "T??n kh??a h???c",
      dataIndex: "courseName",
      key: "courseName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "???nh",
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
      title: "???????ng d???n",
      dataIndex: "slug",
      key: "slug",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Danh m???c cha",
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
      title: "Tr???ng th??i",
      key: "status",
      dataIndex: "status",
      align: "center",
      render: (text: number) => (
        <>
          <Tag color={text === TTCSconfig.STATUS_PUBLIC ? 'green' : 'red'}>
            {status.find(o => o.value === text)?.label}
          </Tag>
        </>
      ),
    },  
    {
      title: "H??nh ?????ng",
      key: "action",
      dataIndex: "value",
      align: "center",
      render: (text: Course, record) => (
        <Space size="middle">
          <Tooltip placement="top" title="Ch???nh s???a">
            <Button onClick={() => {
              setIsModalOpen(true)
              setValueEdit(text)
            }}>
              <EditOutlined />
            </Button>
          </Tooltip>

          {statusCourse !== TTCSconfig.STATUS_DELETED ? 
            <Popconfirm
              placement="topRight"
              title="B???n c?? ch???c b???n mu???n x??a m???c n??y kh??ng?"
              onConfirm={() => {
                handleDelete(text)
              }}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip placement="top" title="X??a">
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
          onClick={showModal}
        >
          Th??m m???i
        </Button>
        <Space size='small'>
          <label style={{ marginLeft: "20px" }}>Ch???n tr???ng th??i: </label>
          <Select
            placeholder={'B??? l???c'}
            style={{ width: 150, marginLeft: "10px" }}
            defaultValue={TTCSconfig.STATUS_PUBLIC}
            options={status}
            onChange={(value) => {
              setStatusCourse(value)
            }}
          />
        </Space>

        <Space size='small'>
          <label style={{ marginLeft: "20px" }}>Ch???n danh m???c: </label>
          <Select
              placeholder={'B??? l???c'}
              style={{ width: 150, marginLeft: "10px" }}
              defaultValue={-1}  
              options={[
                {
                  value: -1,
                  label: "T???t c???"
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
          <label style={{ marginLeft: "20px" }}>Ch???n tag: </label>
          <Select
              placeholder={'B??? l???c'}
              style={{ width: 150, marginLeft: "10px" }}
              defaultValue={-1}  
              options={[
                {
                  value: -1,
                  label: "T???t c???"
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

      <Typography.Title level={3}>Danh s??ch kh??a h???c: </Typography.Title>

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
        title="T???o kh??a h???c"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="L??u"
        cancelText="H???y"
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
              <Form.Item label="M?? t???">
                <TinymceEditor
                  id="descriptionCategory"
                  key="descriptionCategory"
                  editorRef={descRef}
                  value={valueEdit?.des ?? ''}
                  heightEditor="500px"
                />
              </Form.Item>


            </Col>
            <Col xl={8} md={8} xs={24}>
              <Form.Item label={<h3>{'???nh kh??a h???c'}</h3>} name="avatar">
                <UploadImg
                  defaultUrl={valueEdit?.avatar}
                  onChangeUrl={(value) => setDataupload(value)}
                />
              </Form.Item>

              <Form.Item
                name='courseName'
                label="T??n kh??a h???c"
                rules={[
                  {
                    required: true,
                    message: "Vui l??ng nh???p tr?????ng n??y!",
                  },
                ]}
              >
                <Input onChange={(e) => {
                  form.setFieldsValue({ slug: convertSlug(e.target.value) })
                }} />
              </Form.Item>

              <Form.Item name='slug' label="???????ng d???n" rules={[
                {
                  required: true,
                  message: "Vui l??ng nh???p tr?????ng n??y!",
                },
              ]}
              >
                <Input />
              </Form.Item>

              <Form.Item 
                name='idCategory' 
                label="Danh m???c cha" 
                rules={[
                  {
                    required: true,
                    message: "Vui l??ng nh???p tr?????ng n??y!",
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
                    message: "Vui l??ng nh???p tr?????ng n??y!",
                  },
                ]}
              >
                <Select options={tags.map((data) => ({
                  value: data.id,
                  label: data.name,
                }))} />
              </Form.Item>

              <Form.Item name='status' label="Tr???ng th??i">
                <Select options={status} />
              </Form.Item>
            </Col>
            
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CoursePage;
