import TicketModel from '../models/TicketModel';

const countTicketsById = async ({
  projectId,
  status,
}: {
  projectId: string;
  status?: string | null;
}) => {
  const queryFilter = status ? { projectId, status } : { projectId };

  return TicketModel.countDocuments(queryFilter);
};

export default countTicketsById;