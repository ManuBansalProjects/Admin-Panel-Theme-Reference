import React, { useEffect, useState } from 'react';
import { CKEDITOR_CONFIG } from '../../../utils/Constants';
import SendMedia from './sentmedia';

export default function CustomCkeditor(props) {
  const {
    onChange = () => { },
    setFieldValue = () => { },
    config = {},
    fieldname
  } = props;
  const editorId = props.id || fieldname;
  const CKEDITOR_CONFIG_LOCAL = {
    ...CKEDITOR_CONFIG,
  };
  const defaultConfigs = {
    // extraPlugins: 'CustomButton',
    extraPlugins: 'MediaButton',
  };
  function cleanupEditor(editor) {
    // window.CKEDITOR = {...window.CKEDITOR_BACKUP};
    editor.destroy();
  };
  function handleMediaSelectionSubmit(media = []) {
    const editor = window.CKEDITOR.instances[editorId];
    let editorContent = editor.getData() || "";
    media.forEach((file) => {
      const fileExtension = file.split('.').pop().toLowerCase();
      const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);

      if (isImage) {
        editorContent += `<p><img src="${file}" alt="Selected Image"></p>`;
      } else {
        const fileName = file.split('/').pop();
        editorContent += `<p><a href="${file}" target="_blank">${fileName}</a></p>`;
      }
    });
    editor.setData(editorContent);
  };
  /** states >>>> */
  const [openMedia, setOpenMedia] = useState(false);
  /** states <<<< */
  function addMediaButton(editor) {
    let alreadyExist = window.CKEDITOR.plugins.get('MediaButton');
    if (!alreadyExist) {
      window.CKEDITOR.plugins.add('MediaButton', {
        icons: 'mediaButton'
      });
    }
    editor.addCommand('insertMedia', {
      exec: function () {
        setOpenMedia(true);
      }
    });
    editor.ui.addButton('MediaButton', {
      label: 'Select Media',
      command: 'insertMedia',
      toolbar: 'insert',
      icon: '/assets/ckeditor/images/media-icon.png'
    });
  };
  useEffect(() => {
    /** Adding custom button for media selection */
    const editor = window.CKEDITOR.replace(editorId, { ...CKEDITOR_CONFIG_LOCAL, ...config, ...defaultConfigs });
    /** Listening for onchange event */
    addMediaButton(editor);
    editor.on('change', function (event) {
      onChange(event, editor);
      setFieldValue(editorId, editor.getData());
    });
    return () => { cleanupEditor(editor) };
  }, []);
  return (
    <div>
      <textarea id={editorId} defaultValue={props?.data ? props?.data : props?.value}></textarea>
      {openMedia ?
        <>
          <SendMedia
            setOpen={setOpenMedia}
            onSubmit={handleMediaSelectionSubmit}
            successButtonText="Insert"
          />
        </> : null}
    </div>
  )
}
