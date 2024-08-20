import React from 'react';
import DataTable from 'react-data-table-component';
import useDocuments from './useDocuments';

const Documents = () => {
  const [documents,setDocuments] = useDocuments('http://127.0.0.1:8000/api/documents');

  const columns = [
    {
      name: 'Title',
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: 'Content',
      selector: (row) => row.content,
      sortable: true,
    },
    {
      name: 'Created At',
      selector: (row) => new Date(row.created_at).toLocaleDateString(),
      sortable: true,
    },
    {
      name: 'Updated At',
      selector: (row) => new Date(row.updated_at).toLocaleDateString(),
      sortable: true,
    },
  ];

  return (
    <div>
      <h2>Documents</h2>
      <DataTable
        columns={columns}
        data={documents}
        pagination
      />
    </div>
  );
};

export default Documents;
