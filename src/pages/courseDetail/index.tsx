import { useLocation } from 'react-router-dom';

const CourseDetail = () => {

  const location = useLocation();
  console.log('pathname', location.pathname);
  
  return( 
    <div>
      <Row style={{marginBottom: "20px"}}>
        <Space size="small">
          <label style={{ marginLeft: "20px" }}>Chọn phương thức:</label>
          <Select
            placeholder={"Bộ lọc"}
            style={{ width: 200, marginLeft: "10px" }}
            defaultValue={TTCSconfig.STATUS_PUBLIC}
            options={statusTopic}
            onChange={(value) => {
              setType(value)
            }}
          />
        </Space>
      </Row>
      <Row>
        <Col span={5}>
          <Menu
            mode="inline"
            openKeys={openKeys}
            // onClick={onClickChange}
            onOpenChange={onOpenChange}
            style={{ width: "95%", height: "100%" }}
            items={items}
          />
        </Col>

        <Col span={19}>
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
                    // editorRef={descRef}
                    // value={valueEdit?.des ?? ""}
                    heightEditor="400px"
                  />
                </Form.Item>
              </Col>
              <Col xl={8} md={8} xs={24}>
                <Form.Item
                  name='name'
                  label="Tên bài giảng"
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

                <Form.Item
                  name='file'
                  label="Video URL"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập trường này!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Button type="primary">Submit</Button>
                </Form.Item>
                
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      <Modal
        title={`${isEdit ? "Chỉnh sửa" : "Tạo"} bài`}
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
                  // editorRef={descRef}
                  // value={valueEdit?.des ?? ""}
                  heightEditor="500px"
                />
              </Form.Item>
            </Col>
            <Col xl={8} md={8} xs={24}>
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
              </Form.Item>

              <Form.Item name="status" label="Trạng thái">
                <Select options={STATUSES} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

export default CourseDetail