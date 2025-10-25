import React, { useEffect, useState } from "react";
import { CKEditor } from "ckeditor4-react";
import { getUser } from "../../../utils/commonfunction";
import SendMedia from "./sentmedia";
import toHtml from "html-react-parser";

const CustomCkeditor = React.forwardRef((props) => {
  let uniqueId = Math.floor(Math.random() * 1000000);;
  const [editorContent, setEditorContent] = useState(props.value);
  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [isClosing, setIsClosing] = useState(false);

  const onSentClick = (isClosing) => {
    setOpen(false);
    setIsClosing(isClosing);
  };

  const handleChange = (event) => {
    const data = event.editor.getData();
    setEditorContent(data);
    props.setFieldValue(props.fieldname, data);
  };

  const handleCustomButtonClick = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (!selectedMedia.length || isClosing) {
      return;
    }
    let content = editorContent;
    let newValues = "<p>";
    selectedMedia.forEach((item) => {
      newValues = newValues + `<img src="${item}" alt="Selected Image">`;
    });
    newValues = newValues + "</p>";
    content = (content ? content : "") + newValues;
    setEditorContent(() => content);
    props.setFieldValue(props.fieldname, content);
    setSelectedMedia([]);
  }, [open,editorContent,isClosing,props,selectedMedia]);


  return (
    <div>
    {open ? (
      <SendMedia
          setOpen={setOpen}
          chooseMedia={setSelectedMedia}
          onClick={onSentClick}
        />
    ): (
      <CKEditor
      id="ifr"
      onBeforeLoad={(CKEDITOR) => {
        let alreadyExist = CKEDITOR.plugins.get(`cstButton${uniqueId}`);
        if (!alreadyExist) {
          CKEDITOR.plugins.add(`cstButton${uniqueId}`, {
            icons: `cstButton${uniqueId}`,
            init: function (editor) {
              editor.ui.addButton(`CstButton${uniqueId}`, {
                label: "Audio/Video",
                command: `cstButton${uniqueId}`,
                toolbar: "insert, 30",
                name: `cstbutton${uniqueId}`,
                icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaLO2_EFFI-eVhUBi6BS6XKE54viRbADMBb-xvh41zS7Pzk5Ts-fkAHrwIHdfZ2_vYE7g&usqp=CAU",
              });

              editor.addCommand(`cstButton${uniqueId}`, {
                exec: function (edt) {
                  handleCustomButtonClick();
                },
              });
            },
          });
        }
        return (CKEDITOR.disableAutoInline = true);
      }}
      onBeforeDestroy={(CKEDITOR) => {
        if (CKEDITOR?.editor?.commands[`cstButton${uniqueId}`]) {
          CKEDITOR.editor.commands[`cstButton${uniqueId}`].disable();
        }
      }}
      initData={editorContent ? toHtml(editorContent) : ""}
      // data={editorContent}
      onChange={(event, editor) => {
        handleChange(event, editor);
      }}
      config={{
        filebrowserUploadUrl: `${process.env.REACT_APP_API_URL}/admin/ckeditor/upload-ck-image`,
        allowedContent: true,
        fileTools_requestHeaders: {
          Authorization: `Bearer ${getUser().token}`,
        },
        extraPlugins: `cstButton${uniqueId}`,
      }}
    />
    )}
    </div>
  );
});

export default CustomCkeditor;
