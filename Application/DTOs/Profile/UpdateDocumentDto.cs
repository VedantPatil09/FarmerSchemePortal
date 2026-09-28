public class UpdateDocumentDto
{
    public int? DocumentId { get; set; }

    public DocumentType DocumentType { get; set; }

    public string FilePath { get; set; } = null!;
}